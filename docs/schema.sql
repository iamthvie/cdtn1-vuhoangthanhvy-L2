-- Mekong Mobile – Smart CRM – Luồng L2: Tiếp nhận yêu cầu bảo hành
-- SQL DDL skeleton (PostgreSQL 15+). Tên bảng/cột theo thuật ngữ trong SRS.

CREATE TABLE customer (
    customer_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    phone         VARCHAR(15)  NOT NULL,          -- lưu đầy đủ; che số ở lớp API (QT-15)
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE device (
    device_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     BIGINT       NOT NULL REFERENCES customer(customer_id),   -- QT-03: một chủ sở hữu tại một thời điểm
    serial_no       VARCHAR(50)  NOT NULL UNIQUE,                             -- serial/IMEI (QT-03)
    model_name      VARCHAR(100) NOT NULL,
    purchase_date   DATE,                                                     -- NULL = không xác định được ngày mua
    warranty_months SMALLINT     NOT NULL DEFAULT 12 CHECK (warranty_months > 0)
);

CREATE TABLE ticket (
    ticket_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_code       VARCHAR(20)  NOT NULL UNIQUE,                           -- ví dụ BH000123/2026
    device_id         BIGINT       NOT NULL REFERENCES device(device_id),
    service_center_id INTEGER      NOT NULL,                                  -- trung tâm bảo hành (QT-14); danh mục trung tâm nằm ngoài phạm vi ERD
    received_by       INTEGER      NOT NULL,                                  -- mã tài khoản nhân viên tiếp nhận; quản lý tài khoản nằm ngoài phạm vi ERD
    received_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    issue_desc        VARCHAR(1000) NOT NULL CHECK (char_length(btrim(issue_desc)) BETWEEN 10 AND 1000),
    warranty_status   VARCHAR(20)  NOT NULL
                      CHECK (warranty_status IN ('CON_BAO_HANH','HET_BAO_HANH','CHUA_XAC_MINH')),
    is_chargeable     BOOLEAN      NOT NULL DEFAULT FALSE,                    -- BR-A3: hết bảo hành mặc định có tính phí
    status            VARCHAR(20)  NOT NULL DEFAULT 'MOI'                     -- QT-06: phiếu mới ở trạng thái Mới
                      CHECK (status IN ('MOI','DA_PHAN_CONG','DANG_XU_LY','CHO_LINH_KIEN','HOAN_TAT','DA_DONG','DA_HUY')),
    priority          VARCHAR(20)  NOT NULL DEFAULT 'TRUNG_BINH',             -- BR-A4: mặc định, luồng phân loại xử lý sau
    incident_group    VARCHAR(50),                                            -- nhóm sự cố: NULL ở L2 phạm vi này, luồng phân loại điền sau
    idempotency_key   UUID         NOT NULL UNIQUE,                           -- NFR4: lưu lại đúng 1 phiếu khi gửi lặp
    is_deleted        BOOLEAN      NOT NULL DEFAULT FALSE                     -- QT-13: xóa mềm
);
CREATE INDEX idx_ticket_device_received ON ticket (device_id, received_at);          -- FR1, FR8
CREATE INDEX idx_ticket_receiver_day    ON ticket (received_by, received_at);        -- FR9

CREATE TABLE ticket_accessory (
    ticket_id        BIGINT      NOT NULL REFERENCES ticket(ticket_id),
    accessory_code   VARCHAR(20) NOT NULL CHECK (accessory_code IN ('SAC','TAI_NGHE','HOP','KHAC')),
    accessory_note   VARCHAR(255),
    PRIMARY KEY (ticket_id, accessory_code),
    CHECK (accessory_code <> 'KHAC' OR accessory_note IS NOT NULL)            -- FR4: chọn "Khác" bắt buộc ghi chú
);

CREATE TABLE approval_request (
    request_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id        BIGINT       NOT NULL REFERENCES ticket(ticket_id),
    reason           VARCHAR(500) NOT NULL,
    requested_by     INTEGER      NOT NULL,
    requested_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    approval_status  VARCHAR(10)  NOT NULL DEFAULT 'CHO_DUYET'                -- BR-A1: trạng thái phê duyệt riêng, không thêm vào Trạng thái phiếu
                     CHECK (approval_status IN ('CHO_DUYET','DA_DUYET','TU_CHOI')),
    decided_by       INTEGER,
    decided_at       TIMESTAMPTZ,
    decision_reason  VARCHAR(500),
    CHECK (approval_status <> 'TU_CHOI' OR decision_reason IS NOT NULL)       -- FR7: từ chối bắt buộc có lý do
);
CREATE INDEX idx_approval_pending ON approval_request (approval_status, requested_at);   -- FR6

CREATE TABLE ticket_status_log (
    log_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id     BIGINT      NOT NULL REFERENCES ticket(ticket_id),
    from_status   VARCHAR(20),                                                -- NULL khi tạo phiếu
    to_status     VARCHAR(20) NOT NULL,
    changed_by    INTEGER     NOT NULL,
    changed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);