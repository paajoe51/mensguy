# SOFTWARE REQUIREMENTS DOCUMENT (SRD)

# MENSGUY IMPORT LTD

## Import, E-Commerce, Installment Sales, Inventory, Procurement and Business Management System

Version: 1.0

---

# 1. INTRODUCTION

## 1.1 Purpose

The purpose of this system is to provide MENSGUY IMPORT LTD with a centralized platform for managing customer orders, overseas procurement, inventory, installment purchases, customer payments, business finances, delivery operations, reporting, and staff activities.

The system shall support both customer-facing and internal business operations.

---

# 2. BUSINESS OVERVIEW

MENSGUY IMPORT LTD assists customers in purchasing products from overseas and also sells products available in its local warehouse.

Products may include:

* Electronics
* Home appliances
* Cooking utensils
* Fashion products
* Accessories
* Household items
* General eCommerce products

Customers may:

* Purchase available stock
* Request overseas products
* Make full payments
* Purchase through approved installment plans
* Track their orders
* Track payment progress

Staff members manage sourcing, procurement, inventory, finances, deliveries, customer service, and reporting.

---

# 3. SYSTEM USERS

## 3.1 Public Visitor

Can:

* View landing page
* Browse products
* Search products
* View company information
* Register account
* Login

---

## 3.2 Customer

Can:

* Register account
* Login
* Browse products
* Add in-stock products to cart
* Submit overseas item requests
* Checkout orders
* View order history
* View payment history
* Request installment purchase
* Track installment progress
* Update profile

---

## 3.3 Administrator

Has unrestricted access to all modules.

Can:

* Manage staff
* Manage permissions
* Approve financial records
* Override item release restrictions
* Access all reports
* Configure system settings

---

## 3.4 Accounts Officer

Can:

* Record payments
* Generate receipts
* Record expenditures
* View financial records

---

## 3.5 Accounts Head

Can:

* Approve financial entries
* Approve expenditures
* View financial reports
* Monitor cash flow

---

## 3.6 Product Sourcing Officer

Can:

* Manage procurement activities
* Track overseas purchases
* Manage suppliers

---

## 3.7 Order Manager

Can:

* Create orders
* Update order status
* Manage customer requests
* Assign deliveries

---

## 3.8 Delivery Personnel

Can:

* View assigned deliveries
* Update delivery status

---

# 4. PUBLIC WEBSITE MODULE

---

## 4.1 Landing Page

The system shall provide a public landing page containing:

* Company introduction
* Services offered
* Featured products
* How the service works
* Customer testimonials
* Frequently asked questions
* Contact information

Buttons:

* Shop Now
* Request Item
* Customer Login
* Customer Registration
* Staff Login

---

## 4.2 Product Catalogue

The system shall allow visitors and customers to:

* Browse products
* Search products
* Filter products
* View product details

Product statuses:

* Available in Warehouse
* Available Overseas

---

## 4.3 Product Details

The system shall display:

* Product images
* Description
* Category
* Pricing
* Availability status

Actions:

* Add to Cart
* Request Item
* Request Installment

---

## 4.4 Cart Management

Customers shall be able to:

* Add products
* Remove products
* Update quantities
* Review order totals

---

## 4.5 Checkout

The system shall support:

* Pickup option
* Delivery option
* MoMo payment
* Cash payment
* Installment request option

---

## 4.6 Item Request Module

Customers shall be able to request products not currently listed.

Request information:

* Product name
* Product link
* Description
* Quantity
* Notes
* Optional image

---

# 5. CUSTOMER PORTAL

---

## 5.1 Customer Dashboard

Dashboard shall display:

* Total orders
* Active orders
* Outstanding balances
* Active installment plans
* Recent transactions

---

## 5.2 My Orders

Customer shall view:

* Order number
* Status
* Total amount
* Amount paid
* Outstanding balance

---

## 5.3 Order Tracking

Customers shall track order stages:

* Pending
* Processing
* Ordered
* In Transit
* Arrived
* Ready for Pickup
* Out for Delivery
* Delivered

---

## 5.4 Payment History

Customer shall view:

* Payment date
* Amount
* Payment method
* Receipt

---

## 5.5 Installment Tracking

Customer shall view:

* Total amount
* Amount paid
* Outstanding balance
* Due date
* Grace period
* Status

---

# 6. PRODUCT MANAGEMENT MODULE

---

## 6.1 Product Management

Staff shall be able to:

* Create products
* Edit products
* Delete products
* Archive products

Product information:

* Name
* Category
* Description
* Images
* Retail Price
* Wholesale Price
* Promo Price
* Product Type
* Stock Quantity

---

## 6.2 Product Types

Supported product types:

### Warehouse Product

Available immediately.

### Overseas Product

Requires procurement before fulfillment.

---

## 6.3 Categories

Administrators shall manage product categories.

Functions:

* Create
* Update
* Delete

---

# 7. INVENTORY MANAGEMENT MODULE

The system shall maintain stock records.

Features:

* Stock levels
* Restocking
* Stock adjustments
* Low stock alerts
* Stock movement history

---

# 8. CUSTOMER MANAGEMENT MODULE

The system shall maintain customer records.

Customer profile information:

* Name
* Phone
* Email
* Address
* Registration date

Additional information:

* Order history
* Payment history
* Installment history
* Requests history

---

# 9. REQUEST MANAGEMENT MODULE

The system shall manage overseas and custom item requests.

Request statuses:

* Pending
* Under Review
* Approved
* Rejected
* Converted to Order

Staff shall:

* Review requests
* Estimate costs
* Approve requests
* Convert requests into orders

---

# 10. ORDER MANAGEMENT MODULE

---

## 10.1 Order Types

### In-Stock Purchase

Warehouse products.

### Pre-Order

Overseas products.

### Installment Order

Products purchased through payment plans.

---

## 10.2 Order Statuses

* Pending
* Payment in Progress
* Partially Paid
* Fully Paid
* Processing
* Ordered from Supplier
* In Transit
* Arrived
* Ready for Pickup
* Out for Delivery
* Delivered
* Cancelled
* Refunded

---

## 10.3 Order Details

Each order shall maintain:

* Customer information
* Products
* Total amount
* Amount paid
* Outstanding balance
* Payment history
* Procurement information
* Delivery information

---

# 11. PAYMENT MANAGEMENT MODULE

Supported payment methods:

* Mobile Money (MoMo)
* Cash
* Manual Transfer

---

## 11.1 Payment Recording

The system shall:

* Record payments
* Update balances automatically
* Generate receipts

---

## 11.2 Automated Payment Capture

Where integrated with MoMo:

* Payments shall be recorded automatically
* Orders shall update automatically

---

## 11.3 Receipt Management

The system shall generate printable receipts.

Receipt information:

* Receipt Number
* Customer
* Order
* Amount
* Payment Method
* Date

---

# 12. INSTALLMENT MANAGEMENT MODULE

---

## 12.1 Installment Requests

Customers may request installment purchases.

Staff must approve and configure plans.

---

## 12.2 Installment Plan Configuration

Fields:

* Linked Order
* Total Amount
* Initial Deposit
* Due Date
* Grace Period
* Penalty Percentage

---

## 12.3 Installment Rules

Default business rules:

* Fixed installment plan
* Product held until payment completion
* Admin may override release restriction

---

## 12.4 Default Policy

When a customer stops paying:

1. Grace period begins
2. Reminder notices sent
3. Plan becomes defaulted after grace period
4. 30% deduction applied
5. Remaining amount refunded

---

# 13. PROCUREMENT MANAGEMENT MODULE

The system shall track overseas procurement.

Information:

* Supplier
* Purchase Cost
* Shipping Cost
* Expected Arrival Date
* Actual Arrival Date

Statuses:

* Pending
* Ordered
* Shipped
* In Transit
* Arrived
* Closed

---

# 14. DELIVERY MANAGEMENT MODULE

Delivery methods:

* Customer Pickup
* Company Delivery
* Third Party Delivery

Statuses:

* Awaiting Assignment
* Assigned
* In Transit
* Delivered
* Failed

---

# 15. FINANCE MANAGEMENT MODULE

---

## 15.1 Finance Dashboard

Dashboard shall display:

* Total Invested Capital
* Total Funds Received
* Total Expenditure
* Gross Profit
* Net Profit
* Available Business Funds

---

## 15.2 Funds In Management

Source types:

* Business Capital
* Loan
* Shares/Investment Contribution
* Customer Pre-Order Payments
* Other Income

Fields:

* Date
* Source
* Amount
* Notes

---

## 15.3 Expenditure Management

Categories:

* Stock Purchase
* Shipping
* Clearing
* Transport
* Office Expenses
* Salaries
* Refunds
* Loan Repayment
* Miscellaneous

Fields:

* Date
* Purpose
* Amount
* Spending Officer

---

## 15.4 Loan Management

Track:

* Amount Received
* Due Date
* Amount Repaid
* Outstanding Balance

---

## 15.5 Approval Workflow

Finance approvals may only be performed by:

* Administrator
* Accounts Head

Only approved entries affect reports.

---

# 16. REPORTING MODULE

Reports shall support:

* Daily
* Weekly
* Monthly
* Yearly
* Custom Date Range

---

## 16.1 Sales Reports

Show:

* Sales totals
* Sales by product
* Sales by category

---

## 16.2 Profit Reports

Show:

* Gross Profit
* Net Profit
* Profit per Product

---

## 16.3 Installment Reports

Show:

* Active Plans
* Overdue Plans
* Outstanding Balances

---

## 16.4 Inventory Reports

Show:

* Stock Levels
* Low Stock Products
* Best Selling Products

---

## 16.5 Finance Reports

Show:

* Funds Received
* Expenditure
* Loan Reports
* Cash Flow

---

# 17. STAFF MANAGEMENT MODULE

Administrators shall:

* Create staff accounts
* Assign roles
* Disable accounts
* Reset passwords

---

# 18. NOTIFICATION MODULE

Notifications shall support:

* Payment Receipts
* Order Updates
* Installment Reminders
* Grace Period Warnings
* Delivery Updates

Delivery channel:

* SMS API

---

# 19. AUDIT LOG MODULE

The system shall maintain logs for:

* Login activities
* Order changes
* Payment entries
* Finance approvals
* Product updates
* User actions

---

# 20. SYSTEM SETTINGS MODULE

Administrators shall configure:

* Company Information
* SMS API
* Installment Policies
* Penalty Percentage
* Grace Period
* Delivery Settings
* Payment Settings

---

# 21. DASHBOARD KPI SUMMARY

The system dashboard shall display:

* Total Sales
* Orders Today
* Pending Orders
* Active Installments
* Outstanding Balances
* Total Customers
* Available Funds
* Total Expenditure
* Invested Capital
* Gross Profit
* Net Profit
* Deliveries Pending
* Orders in Transit
* Low Stock Alerts
* Overseas Requests

---

# 22. NON-FUNCTIONAL REQUIREMENTS

The system shall be:

* Responsive
* Secure
* Role-Based
* Mobile Friendly
* Fast Performing
* Scalable
* Easy to Maintain
* Easy to Use

The system shall maintain full auditability and data integrity across all business operations.
