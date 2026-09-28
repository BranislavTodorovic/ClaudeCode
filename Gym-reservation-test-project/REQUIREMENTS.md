# REQUIREMENTS — Gym Class Reservation

Working representation of `BRD.md`, derived for implementation use.

`BRD.md` is the authoritative business source. This document restates it; it does not extend it. Every requirement below carries its BRD section reference so it can be traced back. Where this document and `BRD.md` disagree, **`BRD.md` wins** unless a human has approved a requirement change.

---

## 1. Purpose and users

| ID | Requirement | BRD |
|---|---|---|
| R-01 | The application allows a gym visitor to reserve places in predefined group exercise sessions. | §1 |
| R-02 | The user can choose a class, choose a session, choose the number of participants, review the reservation and total price, confirm it, and start another reservation. | §1 |
| R-03 | The intended user is any visitor. No gym membership is required. | §2 |
| R-04 | The application does not require a user account. | §2 |

---

## 2. Classes and prices

| ID | Requirement | BRD |
|---|---|---|
| R-05 | The gym offers exactly four group classes, each with a fixed price per participant. | §3 |
| R-06 | Each class has exactly three predefined sessions. | §3 |

| Class | Price per participant |
|---|---:|
| Yoga | €8 |
| Pilates | €10 |
| Functional Training | €12 |
| Spinning | €11 |

---

## 3. Sessions and initial availability

| ID | Requirement | BRD |
|---|---|---|
| R-07 | Each session has a maximum capacity of 10 participants. | §4 |
| R-08 | Sessions start with the initial available places listed below. | §4 |
| R-09 | A session with no remaining places cannot be reserved. | §4 |

### Yoga — €8

| Session | Initial available places |
|---|---:|
| Monday 18:00 | 10 |
| Wednesday 19:00 | 6 |
| Saturday 10:00 | 2 |

### Pilates — €10

| Session | Initial available places |
|---|---:|
| Tuesday 18:00 | 8 |
| Thursday 19:00 | 4 |
| Saturday 11:30 | 0 |

### Functional Training — €12

| Session | Initial available places |
|---|---:|
| Monday 19:30 | 5 |
| Wednesday 18:00 | 10 |
| Friday 18:30 | 3 |

### Spinning — €11

| Session | Initial available places |
|---|---:|
| Tuesday 19:30 | 7 |
| Thursday 18:00 | 1 |
| Sunday 10:00 | 10 |

---

## 4. Reservation flow

| ID | Requirement | BRD |
|---|---|---|
| R-10 | The application supports this general flow: choose a class; choose one of its sessions; choose the number of participants; review the reservation; confirm the reservation; see a reservation confirmation; start another reservation if desired. | §5 |
| R-11 | Before confirmation, the user can change the selected class, the selected session, and the number of participants. | §5, §6, §10 |

---

## 5. Choosing a class

| ID | Requirement | BRD |
|---|---|---|
| R-12 | The user can select one of the four available classes. | §6 |
| R-13 | When a class is selected, the sessions for that class become available for selection. | §6 |

---

## 6. Choosing a session

| ID | Requirement | BRD |
|---|---|---|
| R-14 | The user can choose one of the predefined sessions for the selected class. | §7 |
| R-15 | For each session the application shows the session day and time. | §7 |
| R-16 | For each session the application shows whether places are still available. | §7 |
| R-17 | For each session the application shows how many places remain. | §7 |
| R-18 | A full session cannot be reserved. | §7 |

---

## 7. Number of participants

| ID | Requirement | BRD |
|---|---|---|
| R-19 | A reservation must be for at least 1 participant. | §8 |
| R-20 | The maximum number of participants is the number of places **currently remaining** in the selected session. | §8 |
| R-21 | If 10 places remain, the user may reserve 1 to 10; if 4 remain, 1 to 4; if none remain, the session cannot be reserved. | §8 |
| R-22 | The application must not allow confirmation of a reservation that exceeds the remaining capacity. | §8 |

---

## 8. Price calculation

| ID | Requirement | BRD |
|---|---|---|
| R-23 | Total reservation price = number of participants × price per participant. | §9 |
| R-24 | The total price is calculated automatically. | §9 |
| R-25 | No payment is made through the application. | §9 |

---

## 9. Reservation summary

| ID | Requirement | BRD |
|---|---|---|
| R-26 | Before confirmation the user can review the reservation. | §10 |
| R-27 | The summary shows the selected class. | §10 |
| R-28 | The summary shows the selected session. | §10 |
| R-29 | The summary shows the number of participants. | §10 |
| R-30 | The summary shows the price per participant. | §10 |
| R-31 | The summary shows the total price. | §10 |
| R-32 | The user can still change the reservation before confirming it. | §10 |

---

## 10. Confirmation

| ID | Requirement | BRD |
|---|---|---|
| R-33 | A valid reservation must be explicitly confirmed by the user. | §11 |
| R-34 | After confirmation the application clearly indicates that the reservation was successful. | §11 |
| R-35 | The confirmation provides enough information for the user to understand what was reserved. | §11 |
| R-36 | No email, SMS, printed ticket, or external confirmation is required. | §11 |

---

## 11. Availability after confirmation

| ID | Requirement | BRD |
|---|---|---|
| R-37 | On confirmation, the reserved number of places is deducted from the remaining availability of that session. | §12 |
| R-38 | Example: a session with 6 places, reserved for 2 participants, then shows 4 places available. | §12 |
| R-39 | Updated availability remains in effect while the application remains open in the current browser session. | §12 |
| R-40 | Refreshing or reopening the application restores the initial availability listed in section 3 above. | §12 |
| R-41 | Availability is not synchronized between different users or different browsers. | §12 |

> **Implementation consequence of R-40:** availability must be held in memory only. Persisting it to `localStorage`, `sessionStorage`, cookies, or IndexedDB would survive a refresh and therefore violate R-40.

---

## 12. Starting another reservation

| ID | Requirement | BRD |
|---|---|---|
| R-42 | After a successful reservation the user can start another reservation. | §13 |
| R-43 | The application returns to a state in which another reservation can be created. | §13 |
| R-44 | Availability changes from reservations already confirmed during the current browser session remain in effect. | §13 |

---

## 13. Invalid or incomplete reservations

| ID | Requirement | BRD |
|---|---|---|
| R-45 | The application must not confirm a reservation when required information is incomplete or invalid. | §14 |
| R-46 | Confirmation is blocked when no class has been selected. | §14 |
| R-47 | Confirmation is blocked when no session has been selected. | §14 |
| R-48 | Confirmation is blocked when the number of participants is below 1. | §14 |
| R-49 | Confirmation is blocked when the number of participants exceeds the remaining places. | §14 |
| R-50 | Confirmation is blocked when the selected session has no available places. | §14 |
| R-51 | The user receives enough feedback to understand that the reservation cannot yet be confirmed. | §14 |

---

## 14. User interface

| ID | Requirement | BRD |
|---|---|---|
| R-52 | The interface is simple and understandable. | §15 |
| R-53 | The user can identify the available classes. | §15 |
| R-54 | The user can identify sessions for the selected class. | §15 |
| R-55 | The user can understand session availability. | §15 |
| R-56 | The user can select the number of participants. | §15 |
| R-57 | The user can review the reservation. | §15 |
| R-58 | The user can confirm a valid reservation. | §15 |
| R-59 | The user can understand when a reservation cannot be confirmed. | §15 |
| R-60 | The user can see the reservation confirmation. | §15 |
| R-61 | The user can start another reservation. | §15 |
| R-62 | The exact visual design is not specified. | §15 |

---

## 15. Personal data

| ID | Requirement | BRD |
|---|---|---|
| R-63 | The application must not require or collect personal information, including name, email address, telephone number, postal address, account information, or payment information. | §16 |
| R-64 | The reservation is anonymous. | §16 |

---

## 16. Scope

| ID | Requirement | BRD |
|---|---|---|
| R-65 | The application includes only the gym-class reservation functionality described in the BRD. | §17 |

Out of scope (§17): user accounts; authentication; memberships; subscriptions; payment processing; discounts or promotions; database storage; backend or server-side functionality; live multi-user availability; waiting lists; personal-trainer scheduling; cancellation; rescheduling; trainer management; email or SMS confirmation; external calendar integration; external APIs; complex date or calendar calculations.

---

## 17. Implementation freedom

| ID | Requirement | BRD |
|---|---|---|
| R-66 | The BRD defines required business behaviour only. It does not prescribe programming language, framework, file structure, internal implementation, state-management approach, automated-test technology, test-document format, or project-plan format. | §18 |

Implementation decisions taken separately for this project are recorded in `CLAUDE.md`.

---

## 18. Delivery expectation

| ID | Requirement | BRD |
|---|---|---|
| R-67 | The result is a small web application that can be demonstrated and reviewed against the BRD. | §19 |
| R-68 | The application is simple enough for a reviewer to understand the main reservation flow and verify representative behaviour. | §19 |
