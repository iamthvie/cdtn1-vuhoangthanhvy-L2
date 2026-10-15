CREATE TABLE IF NOT EXISTS customer (
    customer_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    phone         VARCHAR(15)  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS device (
    device_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id     BIGINT       NOT NULL REFERENCES customer(customer_id),
    serial_no       VARCHAR(50)  NOT NULL UNIQUE,
    model_name      VARCHAR(100) NOT NULL,
    purchase_date   DATE,
    warranty_months SMALLINT     NOT NULL DEFAULT 12 CHECK (warranty_months > 0)
);

CREATE TABLE IF NOT EXISTS ticket (
    ticket_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_code       VARCHAR(20)  NOT NULL UNIQUE,
    device_id         BIGINT       NOT NULL REFERENCES device(device_id),
    service_center_id INTEGER      NOT NULL,
    received_by       INTEGER      NOT NULL,
    received_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    issue_desc        VARCHAR(1000) NOT NULL CHECK (char_length(btrim(issue_desc)) BETWEEN 10 AND 1000),
    warranty_status   VARCHAR(20)  NOT NULL CHECK (warranty_status IN ('CON_BAO_HANH','HET_BAO_HANH','CHUA_XAC_MINH')),
    is_chargeable     BOOLEAN      NOT NULL DEFAULT FALSE,
    status            VARCHAR(20)  NOT NULL DEFAULT 'MOI' CHECK (status IN ('MOI','DA_PHAN_CONG','DANG_XU_LY','CHO_LINH_KIEN','HOAN_TAT','DA_DONG','DA_HUY')),
    priority          VARCHAR(20)  NOT NULL DEFAULT 'TRUNG_BINH',
    incident_group    VARCHAR(50),
    idempotency_key   UUID         NOT NULL UNIQUE,
    is_deleted        BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ticket_accessory (
    ticket_id       BIGINT      NOT NULL REFERENCES ticket(ticket_id),
    accessory_code  VARCHAR(20) NOT NULL CHECK (accessory_code IN ('SAC','TAI_NGHE','HOP','KHAC')),
    accessory_note  VARCHAR(255),
    PRIMARY KEY (ticket_id, accessory_code),
    CHECK (accessory_code <> 'KHAC' OR accessory_note IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS approval_request (
    request_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id        BIGINT       NOT NULL REFERENCES ticket(ticket_id),
    reason           VARCHAR(500) NOT NULL,
    requested_by     INTEGER      NOT NULL,
    requested_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    approval_status  VARCHAR(10)  NOT NULL DEFAULT 'CHO_DUYET' CHECK (approval_status IN ('CHO_DUYET','DA_DUYET','TU_CHOI')),
    decided_by       INTEGER,
    decided_at       TIMESTAMPTZ,
    decision_reason  VARCHAR(500),
    CHECK (approval_status <> 'TU_CHOI' OR decision_reason IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS ticket_status_log (
    log_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id     BIGINT      NOT NULL REFERENCES ticket(ticket_id),
    from_status   VARCHAR(20),
    to_status     VARCHAR(20) NOT NULL,
    changed_by    INTEGER     NOT NULL,
    changed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);