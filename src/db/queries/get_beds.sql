SELECT
    KODEKELAS,
    KODERUANG,
    NAMARUANG,
    SUM(KAPASITAS) AS KAPASITAS,
    SUM(TERSEDIA) AS TERSEDIA,
    SUM(KOSONGMALE) AS TERSEDIAPRIA,
    SUM(KOSONGFEMALE) AS TERSEDIAWANITA,
    SUM(KOSONGMALE) + SUM(KOSONGFEMALE) AS TERSEDIAPRIAWANITA
FROM (
        SELECT
            MRRSAS_KODE_BPJS AS KODEKELAS, MSR_KODE AS KODERUANG, MSR_NAMA AS NAMARUANG, SUM((PAKAI + KOSONG)) AS KAPASITAS, SUM(KOSONG) AS TERSEDIA, CASE
                WHEN MKRWT_GENDER = 'L' THEN SUM(KOSONG)
                ELSE 0
            END AS KOSONGMALE, CASE
                WHEN MKRWT_GENDER = 'P' THEN SUM(KOSONG)
                ELSE 0
            END AS KOSONGFEMALE, SUM(WAITING) AS WAITING
        FROM (
                SELECT DISTINCT
                    A.MBRWT_KODE, C.MSR_KODE, C.MSR_NAMA, B.MKRWT_NAMA, B.REF_KELAS_RLKS_KODE, B.MKRWT_GENDER, CASE
                        WHEN C.MSR_KODE IN ('020703', '021102') THEN 'HCU'
                        WHEN C.MSR_KODE = '020802' THEN 'SAL'
                        WHEN C.MSR_KODE = '020901' THEN 'ICU'
                        WHEN C.MSR_KODE = '021001' THEN 'PIC'
                        WHEN C.MSR_KODE = '021002' THEN 'ISO'
                        WHEN C.MSR_KODE = '021003' THEN 'NIC'
                        WHEN C.MSR_KODE = '021101' THEN 'ICC'
                        ELSE NVL (F.MRRSAS_KODE_BPJS, 'NON')
                    END AS MRRSAS_KODE_BPJS, B.MST_SMF_MSMF_KODE, CASE
                        WHEN D.TMB_STATUS_PAKAI IN ('1', '2', '3', '4')
                        AND NVL (A.MBRWT_ISAKTIF, '0') = '1' THEN 1
                        ELSE 0
                    END AS PAKAI, CASE
                        WHEN NVL (D.TMB_STATUS_PAKAI, '0') = '0'
                        AND NVL (A.MBRWT_ISAKTIF, '0') = '1' THEN 1
                        ELSE 0
                    END AS KOSONG, CASE
                        WHEN J.TRSV_ID IS NOT NULL THEN 1
                        ELSE 0
                    END AS WAITING, NVL (B.MKRWT_KET_KAMAR, '-') AS RRAWAT, CASE
                        WHEN (
                            A.MBRWT_ISAKTIF = 0
                            AND A.REF_STATUS_INAKTIF_RSIN_KODE IN ('0', '1')
                        )
                        AND NVL (A.MBRWT_ISAKTIF, '0') = '1' THEN 1
                        ELSE 0
                    END AS INVALID, CASE
                        WHEN (
                            E.RKLS_KODE = '00'
                            AND C.REF_FUNGSI_RUANG_RFR_KODE != 2
                        )
                        AND NVL (A.MBRWT_ISAKTIF, '0') = '1' THEN 1
                        ELSE 0
                    END AS NONRUANG
                FROM
                    MST_BED_RWT A
                    INNER JOIN MST_KAMAR_RAWAT B ON A.MST_KAMAR_RAWAT_MKRWT_KODE = B.MKRWT_KODE
                    AND B.MKRWT_ISAKTIF = '1'
                    RIGHT JOIN MST_RUANG C ON C.MSR_KODE = B.MST_RUANG_MSR_KODE
                    AND C.MSR_ISAKTIF = '1'
                    LEFT JOIN TRANS_UPDATE_BED D ON D.MST_BED_RWT_MBRWT_KODE = A.MBRWT_KODE
                    INNER JOIN REF_KELAS E ON E.RKLS_KODE = B.REF_KELAS_RLKS_KODE
                    LEFT JOIN MAP_KELAS_RAWAT_RS_ASKES F ON F.REF_KELAS_RKLS_KODE = E.RKLS_KODE
                    OR F.REF_KELAS_RKLS_KODE = E.RKLS_PARENT
                    LEFT JOIN TRANS_KUNJ_PASIEN H ON D.TMB_NOREG = H.TKPAS_NOREG
                    LEFT JOIN MST_PASIEN I ON I.MPAS_NORM = H.TKPAS_NOMR
                    LEFT JOIN TRANS_RESERVASI J ON J.MST_RUANG_MSR_KODE = C.MSR_KODE
                    AND J.REF_KELAS_RKLS_KODE = E.RKLS_KODE
                    AND NVL (J.TRSV_ISBATAL, 0) = 0
                    AND J.TRSV_IS_VERIF IN ('0', '1')
                    AND J.REF_CR_RESERVASI_RCR_KODE IN ('01', '02', '03')
                WHERE
                    1 = 1
                    AND C.REF_FUNGSI_RUANG_RFR_KODE IN ('1', '2', '3')
            )
        WHERE
            INVALID != 1
            AND NONRUANG != 1
        GROUP BY
            MRRSAS_KODE_BPJS, MKRWT_GENDER, MSR_KODE, MSR_NAMA
    )
GROUP BY
    KODEKELAS,
    KODERUANG,
    NAMARUANG