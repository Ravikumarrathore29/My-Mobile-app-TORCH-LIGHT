var DATABASE = {
    NAME: "KEAPRO",
    VERSION: "1.0",
    DISPLAY_NAME: "KEAPRO",
    MAX_SIZE: (5 * 1024 * 1024)
};

var TABLES = {
    GETTABLEINFO: {
        TABLE: "get_table_info",
        FULL_NAME: "full_name",
        DATE: "date"
    },
    USER: {
        TABLE: "user",
        USER_ID: "user_id",
        USER_NAME: "user_name",
        PASSWORD: "password",
        STATUS: "status",
        AREA_RANGE: "area_range",
        EMP_CODE: "emp_code",
        NAME: "name",
        DESIGNATION: "designation",
        DATE_OF_JOINING: "date_of_joining",
        EXPENSE: "expense",
        TERRITORY: "territory",
        COMPANY_ID: "company_id",
        TEAM_ID: "team_id",
        U_STATUS: "u_status",
        R_DATE: "r_date",
        PIN: "pin",
        INSTALLED: "installed",
        VERSION: "version"
    },
    DAILY_REPORT: {
        TABLE: "daily_report",
        ID: "id",
        DCR_SLNO: "dcr_sl_no",
        ACTIVITY_DATE_TIME: "activity_date_time",
        PERIOD: "period",
        ACTIVITY_TYPE: "activity_type",
        DESCRIPTION: "description",
        CREATED_DATE: "created_date",
        STATUS: "status",
        SYNC: "sync",
        LEAVE_TYPE: "leave_type"
    },
    DCR_DOCTOR: {
        TABLE: "dcr_doctor",
        DCR_DOCTOR_SL_NO: "dcr_doctor_sl_no",
        DCR_SL_NO: "dcr_sl_no",
        DOCTOR_SL_NO: "doctor_sl_no",
        TIME_SPENT: "time_spent",
        WORKED_WITH: "worked_with",
        REQUEST: "request",
        REQUEST_DATE: "request_date",
        OBJECTION: "objection",
        OBJECTION_CATEGORY: "objection_category",
        REMARK: "remark",
        RATE: "rate",
        C_DATE: "c_date",
        CAMPAIGN: "campaign",
        STATUS: "status",
        SYS_START_TIME: "sys_start_time",
        SYS_END_TIME: "Sys_end_time"
    },
    PARAMETER: {
        TABLE: "parameter",
        SL_NO: "sl_no",
        PARTICULAR: "particular",
        DATE: "date",
        STATUS: "status",
        MONTH: "month",
        YEAR: "year",
        DAYS: "days"
    },
    DCR_STOCKIST: {
        TABLE: "dcr_stockist",
        DCR_STOCK_ID: "dcr_stock_id",
        DCR_SL_NO: "drc_sl_no",
        STOCKIST_ID: "stockist_id",
        DOB: "dob",
        WORKED_WITH: "worked_with",
        TIME_SPENT: "time_spent",
        C_DATE: "c_date",
        SYS_END_TIME: "sys_end_time"
    },
    DCR_CHEMIST: {
        TABLE: "dcr_chemist",
        DCR_CHEMIST_SLNO: "drc_chemist_sl_no",
        DCR_SL_NO: "drc_sl_no",
        CHEMIST_ID: "chemist_id",
        WORKED_WITH: "worked_with",
        TIME_SPENT: "time_spent",
        C_DATE: "c_date",
        CAMPAIGN: "campaign",
        SYS_END_TIME: "sys_end_time"
    },
    DCRUNLISTEDDOCTORS: {
        TABLE: "dcr_unlisted_doctors",
        DCR_UNLIST_ED_DOCTOR_SL_NO: "dcr_unlist_ed_doctor_sl_no",
        DCR_SL_NO: "dcr_sl_no",
        DOCTOR_NAME: "doctor_name",
        SPECIALITY_ID: "speciality_id",
        CLASSIFICATION: "classification",
        WORKED_WITH: "worked_with",
        TIME_SPENT: "time_spent",
        C_DATE: "c_date",
        STATUS: "status",
        SYS_START_TIME: "sys_start_time",
        SYS_END_TIME: "sys_end_time"

    },
    SPECIALITY: {
        TABLE: "speciality",
        SPEC_ID: "spec_id",
        NAME: "name",
        S_NAME: "s_name"
    },
    DOCTOR_INFO: {
        TABLE: "doctor_info",
        DOCTOR_SL_NO: "doctor_sl_no",
        REGISTRATION_NO: "registration_no",
        NAME: "name",
        CLASSIFICATION: "classification",
        MOBILE_NO: "mobile_no",
        SPECIALITY_ID: "speciality_id",
        MARKET_AREA_ID: "market_area_id",
        LATITUDE: "latitude",
        LONGITUDE: "logitude"
    },
    STOCKIST: {
        TABLE: "stockist",
        STOCKIST_ID: "stockist_id",
        NAME: "name",
        MARKET_AREA_ID: "market_area_id",
        PHONE: "phone",
        CODE: "code",
        CITY: "city",
        LATITUDE: "latitude",
        LONGITUDE: "logitude"
    },
    CHEMISTS: {
        TABLE: "chemists",
        CHEMIST_ID: "chemist_id",
        NAME: "name",
        MARKET_AREA_ID: "market_area_id",
        PHONE: "phone",
        LATITUDE: "latitude",
        LONGITUDE: "logitude"
    },
    MARKET_AREA: {
        TABLE: "market_area",
        MARKET_AREA_ID: "market_area_id",
        MARKET_AREA: "market_area"
    },
    ACTIVITY: {
        TABLE: "activity",
        ACTIVITY_TYPE_ID: "activity_type_id",
        ACTIVITY_NAME: "activity_name"
    },
    PRODUCTGROUPS: {
        TABLE: "product_groups",
        PRODUCT_GROUP_ID: "product_group_id",
        PRODUCT_GROUP_NAME: "product_group_name"
    },
    KEY_MSG: {
        TABLE: "key_msg",
        KEY_ID: "key_id",
        BRAND_ID: "brand_id",
        KEY_CODE: "key_code"
    },
    SAMPLES: {
        TABLE: "samples",
        SAMPLE_ID: "sample_id",
        SAMPLE_NAME: "sample_name",
        PRODUCT_GROUP_ID: "product_group_id",
        UNIT_OF_MEASURE: "unit_of_measure",
        PRODUCT_TYPE_ID: "product_type_id",
        RATE: "rate"
    },
    DCRDDETAILING: {
        TABLE: "dcr_d_detailing",
        DCR_DOCTOR_SL_NO: "dcr_doctor_sl_no",
        BRAND_ID: "brand_id",
        KEY_MESSAGE: "key_message"
    },
    DCRDSAMPLEDETAILS: {
        TABLE: "dcr_d_sample_details",
        DCR_DOCTOR_SL_NO: "dcr_doctor_sl_no",
        SIGNATURE: "signature",
        SAMPLE_ID: "sample_id",
        QUANTITY: "quantity"
    },
    CLASS: {
        TABLE: "class",
        CLASS_ID: "class_id",
        NAME: "name"
    },
    CATEGORY: {
        TABLE: "category",
        CATEGORY_ID: "category_id",
        CATEGORY_NAME: "category_name"
    },
    RATING: {
        TABLE: "rating",
        RATING_ID: "rating_id",
        RATING_NAME: "rating_name"
    },
    CALLPLAN: {
        TABLE: "call_plan",
        DCR_DOCTOR_SLNO: "DCRDOCTOR_SLNO",
        DATE: "DATE"
    },
    RESIGN: {
        TABLE: "resign",
        STATUS: "status"
    },
    MAPPTABLE: {
        TABLE: "map_table",
        DATE: "date",
        PERIOD: "period",
        TYPE: "type"
    },
    CITY: {
        TABLE: "city",
        CITY_ID: "city_id",
        NAME: "name"
    },
//    EFFORTKPI: {
//        TABLE: "effort_KPI",
//    },
//    SALES: {
//        TABLE: "sales"
//    },
//    COMMUNICATIONPAD: {
//        TABLE: "communication_pad",
//    },
    STOCK_SALES_MASTER: {
        TABLE: "stock_sales_master",
        SSS_ID: "sss_id",
        STOCKIST_ID: "stockist_id",
        DATE_CREATED: "date_created",
        YEAR: "year",
        MONTH: "month",
        SUBMITTED_STATUS: "submitted_status",
        SYNCH_STATUS: "synch_status",
        SUBMITTED_DATE: "submitted_date",
        FS_STATUS: "fs_status"
    },
    STOCK_SALES_DETAILS: {
        TABLE: "stock_sales_details",
        SSS_ID: "sss_id",
        SKU_ID: "sku_id",
        OPENING_BALANCE: "opening_balance",
        RECEIPT: "receipt",
        PURCHASE_RETURN: "purchase_return",
        SECONDARY_SALES: "secondary_sales",
        SALES_RETURN: "sales_return",
        CLOSING_STOCK: "closing_stock",
        SINK_SSTATUS: "sink_status"
    },
    SKUMAT: {
        TABLE: "skumat",
        CODE: "code",
        NAME: "name",
        BRANDNAME: "brand_name"
    },
    SS_PARAMETER: {
        TABLE: "ss_parameter",
        SS_ENTRY: "ss_entry",
        CS_ENTRY: "cs_entry",
        PR_ENTRY: "pr_entry",
        SR_ENTRY: "sr_entry",
        OS_ENTRY: "os_entry",
        RT_ENTRY: "rt_entry",
        CUT_OFF_DAY: "cut_off_day",
        WARNING_DAY: "warning_day"
    },
    RCPA_CHEMISTDOCTORMAP: {
        TABLE: "rcpa_chemist_doctor_map",
        CHEMIST_ID: "chemist_id",
        DOCTOR_SL_NO: "doctor_sl_no"
    },
    RCPA_BRANDCOMPETITORMAP: {
        TABLE: "rcpa_brand_competitor_map",
        PRODUCT_GROUP_ID: "product_group_id",
        COMPETITOR_ID: "competitor_id",
        COMPETITOR_NAME: "competitor_name",
        MOLECULE: "molecule"
    },
    RCPA_MARKETINTELLIGENCE: {
        TABLE: "rcpa_market_intelligence",
        MARKET_INTELLIGENCE_ID: "market_intelligence_id",
        PRIMARY: "primary",
        MARKET_INTELLIGENCE_NAME: "market_intelligence_name",
        REMARKS: "remarks"
    },
    RCPA_ADDENTRY: {
        TABLE: "rcpa_add_entry",
        RCPA_ID: "rcpa_id",
        ACTIVITY_DATE: "activity_date",
        CHEMIST_ID: "chemist_id",
        DOCTOR_SL_NO: "doctor_sl_no",
        PRODUCT_GROUP_ID: "product_group_id",
        TOTAL_RX: "total_rx",
        MOLECULE: "molecule",
        BRAND_RX: "brand_rx",
        COMPETITOR_ID1: "compititor_id1",
        COMPETITOR_RX1: "competitor_rx1",
        COMPETITOR_ID2: "competitor_id2",
        COMPETITOR_RX2: "competitor_rx2",
        COMPETITOR_ID3: "competitor_id3",
        COMPETITOR_RX3: "competitor_rx3",
        COMPETITOR_ID4: "competitor_id4",
        COMPETITOR_RX4: "competitor_rx4",
        COMPETITOR_ID5: "competitor_id5",
        COMPETITOR_RX5: "competitor_rx5",
        MARKET_INTELLIGENCE_ID: "market_intelligence_id",
        MI_REMARKS: "mi_remarks",
        RCPA_STATUS: "rcpa_status",
        RCPA_SYNC: "rcpa_sync"
    },
    RCPA_ADDENTRYCHEMIST: {
        TABLE: "rcpa_add_entry_chemist",
        RCPA_ID: "rcpa_id",
        CHEMIST_ID: "chemsit_id",
        ACTIVITY_DATE: "activity_date",
        RCPA_SYNC_STATUS_CHEMIST: "rcpa_sync_status_chemist",
        RCPA_STATUS_CHEMIST: "rcpa_status_chemist",
        FINAL_STATUS_CHEMIST: "final_status_chemist",
        RCPA_SYNC_STATUS_MI: "rcpa_sync_status_mi"
    },
    RCPA_ADDENTRYBRAND: {
        TABLE: "rcpa_add_entry_brand",
        RCPA_ID: "rcpa_id",
        DOCTOR_SL_NO: "doctor_sl_no",
        PRODUCT_GROUP_ID: "product_group_id",
        TOTAL_RX: "total_rx",
        MOLECULE: "molecule",
        BRAND_RX: "brand_rx",
        COMPETITOR_ID1: "competitor_id1",
        COMPETITOR_RX1: "competitor_rx1",
        COMPETITOR_ID2: "competitor_id2",
        COMPETITOR_RX2: "competitor_rx2",
        COMPETITOR_ID3: "competitor_id3",
        COMPETITOR_RX3: "competotor_rx3",
        COMPETITOR_ID4: "competitor_id4",
        COMPETITOR_RX4: "competitor_rx4",
        COMPETITOR_ID5: "competitor_id5",
        COMPETITOR_RX5: "competitor_rx5",
        RCPA_SYNC_STATUS_BRAND: "rcpa_sync_status_brand"
    },
    RCPA_ADDENTRYMARKETINTELLIGENCESSSS: {
        TABLE: "rcpa_add_entry_market_intelligence",
        RCPA_ID: "rcpa_id",
        MARKET_INTELLIGENCE_ID: "market_intelligence",
        MI_REMARKS: "mi_remarks",
        MI_STATUS: "mi_status"
    },
    LOCTION_INFO: {
        TABLE: "location_info",
        DCR_ID: "dcr_id",
        L_CALL_ID: "l_call_id",
        DOCUMENT_ID: "document_id",
        LAT: "lat",
        LONG: "long",
        DCR_DOCTOR_SLNO: "dcr_doctor_sl_no",
        DOCUMENT_TO: "document_to"
    },
    DCRLOCK: {
        TABLE: "dcr_lock",
        USER_ID: "user_id",
        ACTIVITY_DATE: "activity_date",
        UNLOCK: "unlock",
        DATE: "date",
        SYNC_STATUS: "sync_status",
        UPDATE: "updated"
    },
    CAMPAIGNPLAN: {
        TABLE: "campaign_plan",
        CAMPAIGN_ID: "campaign_id",
        NAME: "name",
        STATUS_CODE: "status_code",
        FROM_DATE: "from_date",
        TO_DATE: "to_date",
        CHEMIST_ID: "chemist_id",
        DOCTOR_SL_NO: "doctor_sl_no"
    },
    FEEDBACKINFO: {
        TABLE: "feedback_info",
        ID: "ID",
        NAME: "name",
        RATING: "rating",
        DELETED: "deleted"
    },
    FILETYPE: {
        TABLE: "file_type",
        ID: "id",
        NAME: "name",
        DELETED: "deleted"
    },
    EGROUP: {
        TABLE: "e_group",
        ID: "id",
        NAME: "name",
        DELETED: "deleted"
    },
    FAVOURITE: {
        TABLE: "favourite",
        ID: "id",
        NAME: "name",
        DELETED: "deleted"
    },
    FAVOURITEDETAIL: {
        TABLE: "favourite_detail",
        FAVOURITE_ID: "favourite_id",
        BRAND: "brand",
        CONTENT: "content"
    },
    EBRANDS: {
        TABLE: "e_brands",
        DCRDOCTOR_SLNO: "dcr_doctor_sl_no",
        DCR_SL_NO: "dcr_sl_no",
        BRAND_ID: "dcr_sl_no_brand_id",
        KEY_ID: "key_id",
        TIME: "time",
        CONTENT_ID: "content_id",
        FEEDBCK_ID: "feedback_id"
    },
    EUNLISTEDBRANDS: {
        TABLE: "e_unlisted_brands",
        DCR_UL_DOCTOR_SLNO: "dcr_ul_doctor_sl_no",
        DCR_SLNO: "dcr_sl_no",
        BRAND_ID: "brand_id",
        KEY_ID: "key_id",
        TIME: "time",
        CONTENT_ID: "content_id",
        FEEDBCK_ID: "feedback_id"

    },
    ESAMPLE: {
        TABLE: "e_sample",
        DCR_DOCTOR_SL_NO: "dcr_doctor_sl_no",
        DCR_SL_NO: "dcr_sl_no",
        SAMPLE_ID: "sample_id",
        POB: "pob"
    },
    DETAILINGTO: {
        TABLE: "detailing_to",
        ID: "id",
        NAME: "name",
        DELETED: "deleted"
    },
    EBRANDMAP: {
        TABLE: "e_brand_map",
        ID: "id",
        CONTENT_ID: "content_id",
        BRAND_ID: "brand_id",
        KEY_MESSAGE_ID: "key_message_id",
        DELETED: "deleted"
    },
    ESPECIALITY: {
        TABLE: "e_speciality",
        ID: "id",
        CONTENT_ID: "content_id",
        DELETED: "deleted"
    },
    CONTENT: {
        TABLE: "content",
        ID: "id",
        NAME: "name",
        FROM_DATE: "from_date",
        TO_DATE: "to_date",
        ENABLED: "enabled",
        CONTENT: "content",
        GROUP_ID: "group_id",
        DETALING_TO: "detaling_to",
        SYNCED: "synced",
        LOCAL_FILE_PATH: "local_file_path",
        FILE_TYPE_ID: "file_type_id",
        DELETED: "deleted"
    },
    SSCLOSINGSTOCK: {
        TABLE: "ss_closing_stock",
        STOCKIST_ID: "stockist_id",
        MONTH: "month",
        YEAR: "year",
        PRODUCT_ID: "product_id",
        CLOSING_STOCK: "closing_stock"
    },
    SECONDARSALESLAST: {
        TABLE: "secondar_sales_last",
        ID: "id",
        MONTH: "month",
        YEAR: "year"
    },
    DCREDETAILPAGETRACKING: {
        TABLE: "dcre_detail_page_tracking",
        ID: "id",
        DCRDOCTOR_SLNO: "dcr_doctor_sl_no",
        CONTENT_ID: "content_id",
        BRAND_ID: "brand_id",
        PAGE_ID: "page_id",
        PAGE_TITLE: "page_title",
        VIEW_TIME: "view_time"
    },
    DCREDETAILPAGELIKE: {
        TABLE: "dcre_detail_page_like",
        ID: "id",
        PAGE_TRACKING_ID: "page_tracking_id",
        LIKES: "likes"
    },
    DCREDETAILPAGEFAVORITES: {
        TABLE: "dcre_detail_page_favorites",
        ID: "id",
        HREF: "href",
        TITLE: "title",
        CONTENT_ID: "content_id",
        BRAND_ID: "brand_id"
    },
    DCREDETAILPAGEGROUPING: {
        TABLE: "dcre_detail_page_grouping",
        ID: "id",
        GROUP_ID: "group_id",
        GROUP_NAME: "group_name",
        FAV_ID: "favid",
        PAGE_ORDER: "page_order"
    },
    GUIDELINE: {
        TABLE: "guide_line",
        ID: "id",
        GUIDELINE_ID: "guide_line_id",
        GUIDELINE_MSG: "guide_line_msg",
        NEED_ACCEPTANCE: "need_acceptance"
    },
    GUIDELINEACCEPETED: {
        TABLE: "guideline_accepeted",
        GUIDELINE_ID: "guideline_id",
        ACCEPTED: "accepted",
        GUIDELINE_SHOWN: "guideline_shown"
    },
    REQUESTTYPE: {
        TABLE: "request_type",
        REQUEST_ID: "request_id",
        REQUEST_NAME: "request_name"
    },
    NOTIFICATIONDETAILS: {
        TABLE: "notification_details",
        ID: "id",
        PROCESS_ID: "process_id",
        PROCESS_NAME: "process_name"
    },
    NOTIFICATION: {
        TABLE: "notification",
        ID: "id",
        NOTIFICATION_COUNT: "notification_count",
        REMAINDER_COUNT: "remainder_count"
    },
    DCRBRANDORDER: {
        TABLE: "dcr_brand_order",
        DCR_SLNO: "dcr_sl_no",
        DCR_DOCTOR_SLNO: "dcr_doctor_sl_no",
        SKU_ID: "sk_uid",
        CATEGORY_ID: "category_id",
        BRAND_ID: "brand_id",
        POB_QTY: "pob_qty",
        PRICE: "price",
        POB_VAL: "pob_val",
        STOCKIST_ID: "stockist_id"
    },
    VERSION: {
        TABLE: "version",
        ID: "id",
        URL: "url",
        OLD_ERSION: "old_version",
        CURRENT_VERSION: "current_version"
    },
    EFFORT_KPI: {
        TABLE: "effort_kpi",
        FIELD_DAYS: "field_days",
        LISTED_DOCTORS: "listed_doctors",
        LISTED_DOCTORS_MET: " listed_doctors_met",
        LISTED_CALLS: "listed_Calls",
        UNLISTED_DOCTORS_MET: " unlisted_doctors_met",
        TARGET_VISIT: " target_visit",
        ACTUAL_VISIT: "actual_visit",
        A_DOCTORS: "a_doctors",
        B_DOCTORS: "b_doctors",
        C_DOCTORS: "c_doctors",
        D_DOCTORS: "d_doctors",
        A_DOCTORS_MET: "a_doctors_met",
        B_DOCTORS_MET: "b_doctors_met",
        C_DOCTORS_MET: "c_doctors_met",
        D_DOCTORS_MET: "d_doctors_met",
        A_TARGET_VISIT: "a_target_visit",
        B_TARGET_VISIT: "b_target_visit",
        C_TARGET_VISIT: "c_target_visit",
        A_CALLS_AS_PER_TARGET: "a_calls_as_per_target",
        B_CALLS_AS_PER_TARGET: "b_calls_as_per_target",
        C_CALLS_AS_PER_TARGET: "c_calls_as_per_target",
        LEAVE_DAYS: "leave_days",
        JOIN_TEGER_WORK_CALLS: "join_teger_work_calls",
        JOIN_TEGER_WORK_DAYS: "join_teger_work_days",
        NO_OF_CHEMISTS: "No_of_chemists",
        CHEMIST_MET: "chemist_met",
        CHEMIST_CALLS: "chemist_calls",
        POB: "pob",
        TOTAL_STOCKISTS: "total_stockists",
        STOCKIST_MET: "stockist_met",
        STOCKIST_CALLS: "stockist_calls",
        DOB: "dob",
        LAST_ACTIVITY_DATE_PROCESSED: "last_activity_date_processed",
        EXECUTED_DAYE: "executed_date",
        MONTH: "month",
        YEAR: "Year",
        DOCTOR_CALL_AVERAGE: "doctor_call_average",
        FREQ_ACH: "freq_ach",
        A_DOCTOR_COVERAGE: "a_doctor_coverage",
        B_DOCTOR_COVERAGE: "b_doctor_coverage",
        C_DOCTOR_COVERAGE: "c_doctor_coverage",
        D_DOCTOR_COVERAGE: "d_doctor_coverage",
        DOCTOR_COVERAGE: "doctor_coverage",
        UNLISTED_DOCTORS_CALL_PERCENTAGE: "unlisted_doctors_call_percentage",
        CHEMIST_COVERGAE: "chemist_coverage",
        CHEMIST_CALL_AVG: "chemist_call_avg"
    },
    SALES: {
        TABLE: "sales",
        YEAR: "year",
        MONTH: "month",
        TARGET_PRIMARY_SALES_MTD: "target_primary_sales_mtd",
        TARGET_PRIMARY_SALES_MTD_LY: "target_primary_sales_mtd_ly",
        TARGET_PRIMARY_SALES_YTD: "target_primary_sales_ytd",
        TARGET_PRIMARY_SALES_YTD_LY: "target_primary_sales_ytd_ly",
        PRIMARY_SALES_MTD: "primary_sales_mtd",
        PRIMARY_SALES_MTD_LY: "primary_sales_mtd_ly",
        PRIMARY_SALES_YTD: "primary_sales_ytd",
        PRIMARY_SALES_YTD_LY: "primary_sales_ytd_ly",
        SECONDARY_SALES_MTD: "secondary_sales_mtd",
        SECONDARY_SALES_MTD_LY: "secondary_sales_mtd_ly",
        SECONDARY_SALES_YTD: "secondary_sales_ytd",
        SECONDARY_SALES_YTD_LY: "secondary_sales_ytd_ly",
        LAST_UPDATED_DATE: "last_updated_date"
    },
    COMMUNICATION_PAD: {
        TABLE: "communication_pad",
        COMMUNICATION_ID: "communication_id",
        MESSAGE_SENT_BY: "message_sent_by",
        VALID_FROM: "valid_from",
        VALID_TO: "valid_to",
        MESSAGE: "message",
        CREATED_DATE: "created_date",
        READ_STATUS: "read_status"
    },
    LATEST_CUSTOMER_ADDED: {
        TABLE: "latest_customer_added",
        CUSTOMER_DCR_SL_NO: "customer_dcr_sl_no",
        CUSTOMER_NAME: "customer_name",
        CUSTOMER_SL_NO: "customer_sl_no",
        CUSTOMER_TYPE: "customer_type"
    },
    PRODUCT_TYPE: {
        TABLE: "product_type",
        PRODUCT_TYPE_ID: "product_type_id",
        NAME: "name"
    },
    SAMPLE_REQUEST: {
        TABLE: "sample_request",
        DCR_SL_NO: "dcr_sl_no",
        CUSTOMER_ID: "customer_id",
        SAMPLE_ID: "sample_id",
        SAMPLE_TYPE_ID: "sample_type_id",
        SIGNATURE: "signature",
        REMARKS: "remarks",
        QUANTITY: "quantity",
        DATE: "date"
    },
    ENTERED_DATES: {
        TABLE: "entered_dates",
        ACTIVITY_DATE: "activity_date",
        ACTIVITY_PEROID: "activity_peroid"
    },
    WORKED_WITH: {
        TABLE: "worked_with",
        WORKEDWITH_ID: "workedwith_id",
        WORKEDWITH_NAME: "workedwith_name",
        ORDER_NO: "order_no",
        WORKEDWITH_SEQUENCE: "workedwith_sequence"
    },
    CALLPLANCHEMIST: {
        TABLE: "CALLPLANCHEMIST",
        CHEMIST_SLNO: "Chemist_SLNO",
        DATE: "DATE"
    },
    CALLPLANSTOCKIST: {
        TABLE: "CALLPLANSTOCKIST",
        STOCKIST_SLNO: "Stockist_SLNO",
        DATE: "DATE"
    }
};


