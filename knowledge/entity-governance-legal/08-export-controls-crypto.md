# 08. Export controls for cryptographic open-source software

Scope: how US export controls (the Export Administration Regulations) apply to publishing open-source software that contains cryptography, including the ECCN 5D002 classification, the publicly-available source provisions, BIS notification, and CCATS classification.

## The classification: ECCN 5D002

Encryption software is classified under the Export Control Classification Number 5D002 ("software" category of encryption items), with hardware in 5A002; encryption is one of the most heavily regulated areas of the US export control system, and the ENC license exception and mass-market classification are the two main paths for authorization (https://eccnfinder.com/guides/encryption-eccn-5a002-5d002, jev weight 0.16, weak backing).

The open-source path is specific. Open-source encryption source code requires a notification to BIS (crypt@bis.doc.gov) with the URL of the posted source, after which it is publicly available and not subject to the EAR; however, compiled or commercial products built from the open source must still be independently classified (https://eccnfinder.com/eccn/5d002, jev weight 0.36, weak backing).

## The regulation text: 15 CFR 742.15 and 734.17

The controlling regulation is 15 CFR 742.15, "Encryption items": for publicly available encryption source code classified under ECCN 5D002 that provides or performs non-standard cryptography as defined in part 772 of the EAR, you must notify BIS and the ENC Encryption Request Coordinator by email of the internet location of the source code (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.15, jev weight 0.97).

The publicly-available treatment itself lives in 15 CFR 734.17, "Export of encryption source code and object code," which cross-references the additional requirements of 742.15(b) under which exports of encryption source code are considered publicly available consistent with 734.3(b)(3) (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.17, jev weight 0.94).

Industry guidance confirms the notification history: previously, in order for publicly available encryption software under ECCN 5D002 to be not subject to the EAR, email notifications were required regardless of whether the cryptography implemented was standardized (https://www.linuxfoundation.org/resources/publications/understanding-us-export-controls-with-open-source-projects, jev weight 0.84).

## CCATS and self-classification

For products (as opposed to posted source code), the classification mechanism is CCATS, the Commodity Classification Automated Tracking System, through which the Bureau of Industry and Security assigns an alphanumeric code to products classified under the EAR (https://en.wikipedia.org/wiki/Commodity_Classification_Automated_Tracking_System, jev weight 0.06, weak backing). BIS's own guidance describes the CCATS review process: for items not described in certain license exception provisions, the submitter must provide sufficient documentation of the product's features for BIS to make an accurate determination (https://media.bis.gov/learn-support/encryption-controls/encryption-review-ccats, jev weight 0.94).

BIS's encryption FAQs add the practical point that exporters who are not the producer of an encryption item can rely on the self-classification or the CCATS classification published by the producer (https://www.bis.gov/media/documents/encryption-faqs, jev weight 0.88).

## What this frames for an open-source security project

For a project distributing cryptography in the open, the dig supports a specific compliance picture, not legal clearance:

1. Posting encryption source code publicly triggers a notification obligation to BIS and the ENC Encryption Request Coordinator for non-standard cryptography under 15 CFR 742.15 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.15, jev weight 0.97).
2. The publicly-available source code treatment is a defined regulatory path (15 CFR 734.17), not an automatic exemption (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.17, jev weight 0.94).
3. Compiled binaries and commercial builds derived from the source follow a separate classification path (self-classification report or CCATS) (https://eccnfinder.com/eccn/5d002/, jev weight 0.60, weak backing; https://media.bis.gov/learn-support/encryption-controls/encryption-review-ccats, jev weight 0.90).

The source document for this corpus correctly flags that these generalizations need export-control counsel to confirm for the project's specific situation; this doc supplies the regulatory hooks counsel would start from, not the confirmation.
