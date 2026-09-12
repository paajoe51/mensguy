MENSGUY IMPORT LTD — FULL UI GENERATION SPECIFICATION
Project Title

MENSGUY IMPORT LTD Business Operations, E-commerce, Installment, Procurement, and Finance Management System

Project Overview

Design a complete modern web-based UI system for MENSGUY IMPORT LTD, a company that helps customers purchase products locally and from overseas. The platform should include:

Public landing page
Public shop
Customer registration and login
Customer dashboard
Internal staff/admin dashboard
Products and inventory management
Orders and requests management
Installment management
Overseas procurement management
Delivery management
Finance and cash flow management
Reports and analytics
Staff and role management
SMS / notification views

The system should be designed as a professional business platform with both a customer-facing side and an internal operations side.

1. DESIGN STYLE AND UI DIRECTION
General UI Style

Create a clean, modern, professional, mobile-responsive interface suitable for an import, retail, and business operations company.

Preferred style
Modern business dashboard aesthetic
Clean spacing
Clear hierarchy
Cards, tables, modals, tabs, badges
Elegant but practical
Good contrast and readability
Professional e-commerce feel for public pages
Professional ERP/admin feel for internal pages
Visual direction
Corporate and trustworthy
Friendly but organized
Minimal clutter
Strong call-to-action buttons
Status badges for different business states
Responsive layouts for desktop, tablet, and mobile
Suggested UI patterns
Sidebar + topbar for admin area
Top navigation for public pages
Cards for summaries
Data tables for operations
Timeline/progress indicators for order and installment tracking
Charts for dashboard and reports
Modal forms and drawer panels where useful
Color approach

Use a professional business palette with strong primary color accents, soft neutrals, and clear semantic colors for:

success
warning
danger
info
pending
completed
Typography

Readable, modern sans-serif. Clear heading hierarchy. Strong emphasis on dashboard stats and status labels.

2. BUSINESS CONTEXT
Company Name

MENSGUY IMPORT LTD

Business Type

Import assistance, local stock sales, overseas procurement, installment-based sales, and customer order fulfillment.

Business Description

The company assists customers in buying items from outside the country and also sells items available in its local warehouse. Products may include electronics, home items, cooking utensils, fashion items, and other products from e-commerce platforms.

Customers can:

browse available products
buy in-stock items
request overseas items
request installment purchase arrangement
pay via mobile money or manual payment methods
track orders and payments

Staff can:

manage products
manage inventory
process customer requests
manage orders and payments
configure installment plans
track overseas procurement
manage delivery
record finance and expenditure
approve financial records
view reports
3. USER TYPES

Design all UI flows for these user roles:

Public Visitor

Can:

view landing page
browse products
view services
search products
see featured items
register/login
Customer

Can:

register and login
browse products
add in-stock items to cart
checkout
request overseas items
request installment
track orders
track payments
view installment progress
manage profile
Admin

Can:

full access to all modules
approve financial records
manage users and roles
override item release policy
Accounts Officer

Can:

record payments
manage receipts
view finance entries
record expenditure
Accounts Head

Can:

approve finance and expenditure entries
monitor cash flow
view finance reports
Product Sourcing Officer

Can:

manage overseas sourcing
track suppliers and procurement stages
Order Manager

Can:

process requests
create and update orders
track customer order lifecycle
Delivery Personnel

Can:

view assigned deliveries
update delivery status
4. HIGH-LEVEL SYSTEM STRUCTURE

Design the system as two connected interfaces:

A. Public / Customer-facing Platform

Includes:

landing page
product shop
product details
customer registration/login
cart
checkout
request item flow
customer dashboard
B. Internal Business Management Platform

Includes:

admin/staff login
staff dashboard
products
inventory
customers
orders
installment management
procurement
delivery
finance
reports
staff management
settings
5. COMPLETE SCREEN LIST

Design all the following screens.

6. PUBLIC WEBSITE SCREENS
6.1 Landing Page

Purpose: Introduce company and guide visitors to shop or login.

Sections:

Hero section with company name, tagline, and CTA buttons
About the company
Services section
How it works
Featured products
Why choose us
Testimonials or trust section
FAQ
Contact section
Footer with quick links, contact details, and social links

Important buttons:

Shop Now
Request Item
Customer Login/Register
Staff Login
Contact Us
6.2 About Page

Sections:

company story
mission and vision
services
business strengths
CTA
6.3 Services Page

Show service cards for:

overseas shopping assistance
local warehouse products
installment purchase option
delivery coordination
product request service
6.4 Shop Page

Purpose: Public product catalogue.

Features:

product grid layout
filters by category
filters by availability: In Stock / Overseas
price filter
search bar
product cards with image, name, price, availability badge, promo badge if applicable
quick action buttons

Each product card should show:

product image
product name
short description
price
retail/wholesale/promo label if relevant
stock/availability status
button:
Add to Cart for in-stock items
Request Item for overseas items
6.5 Product Details Page

Show:

large product image gallery
name
full description
category
pricing info
availability status
stock status
related products
action buttons

Actions:

Add to Cart if in-stock
Request Item if overseas
Request Installment
Contact for more info
6.6 Customer Registration Page

Fields:

full name
phone number
email optional
password
confirm password

UI notes:

simple clean form
trust message
login link
6.7 Customer Login Page

Fields:

phone/email
password
forgot password
link to register
6.8 Forgot Password / Reset Password Pages

Simple secure forms.

6.9 Cart Page

Features:

list cart items
product image
name
quantity controls
unit price
subtotal
remove item
cart summary
continue shopping
proceed to checkout
6.10 Checkout Page

Show:

order summary
delivery option
customer information
payment option
installment request option

Fields and actions:

select pickup or delivery
delivery address if delivery selected
choose payment method
select full payment or request installment
place order

Important note:
Installment is only a request from frontend. Staff configures it later.

6.11 Request Item Page

Purpose: For overseas or custom product request.

Fields:

product name
product link optional
product description
quantity
notes
image upload optional

Sections:

explanation of how request process works
submit request button
6.12 Contact Page

Fields:

name
phone
message
inquiry type

Also show:

company contact info
WhatsApp CTA
map placeholder
7. CUSTOMER DASHBOARD SCREENS
7.1 Customer Dashboard Home

Cards:

total orders
active orders
installment plans
amount paid
outstanding balance

Sections:

recent orders
payment progress
installment reminders
notifications
quick actions
7.2 My Orders Page

Table or card list showing:

order number
date
type
status
total
amount paid
balance
action: view details

Filters:

active
completed
cancelled
pre-order
installment
7.3 Order Details Page

Show:

order summary
items
payment history
balance
order timeline/status tracker
delivery or pickup info
installment request/plan status
messages/notifications related to this order
7.4 My Requests Page

Show all item requests with statuses:

pending
under review
approved
rejected
converted to order
7.5 Installment Overview Page

Show:

active installment plans
completed plans
overdue plans
due dates
payment progress bars
remaining balance
7.6 Payment History Page

Show:

date
order
amount
payment method
receipt/reference
status
7.7 Customer Profile Page

Fields:

name
phone
email
address
password update
8. STAFF / ADMIN AUTHENTICATION
8.1 Staff Login Page

Professional admin login UI with:

username/email
password
forgot password
company branding
9. INTERNAL ADMIN / STAFF PLATFORM

Use a sidebar dashboard layout.

Main navigation:

Dashboard
Products
Categories
Customers
Requests
Orders
Installments
Procurement
Delivery
Finance
Reports
Staff & Roles
Notifications
Settings
10. ADMIN DASHBOARD
10.1 Main Dashboard

Show key summary cards:

total sales
total orders
pending orders
in-stock products
overseas requests
active installments
overdue installments
total invested capital
total expenditure
net profit
available business funds

Also show:

cash flow trend chart for selected period
sales trend chart
recent orders
pending approvals
low stock alerts
overdue installment alerts
latest expenditures
latest finance entries

Filters:

today
this week
this month
this year
custom date range
11. PRODUCTS & INVENTORY MODULE
11.1 Products List Page

Table/cards with:

product image
product name
category
type (warehouse / overseas)
retail price
wholesale price
promo price
stock quantity
status
actions

Actions:

add product
edit
delete
view
restock
mark availability

Filters:

category
status
stock level
product type
11.2 Add/Edit Product Page

Fields:

product name
category
description
images
product type: warehouse / overseas
retail price
wholesale price
promo price
stock quantity
status
featured yes/no
11.3 Categories Page

Simple category management:

list
add category
edit category
delete category
11.4 Inventory / Stock Page

Show:

stock count
low stock items
stock movement history
restock actions
12. CUSTOMER MANAGEMENT MODULE
12.1 Customers List Page

Show:

customer name
phone
email
total orders
active orders
outstanding balance
account status

Actions:

view profile
view orders
view payment history
12.2 Customer Details Page

Sections:

profile info
order history
payment history
active installment plans
requests
notes
13. REQUEST MANAGEMENT MODULE
13.1 Requests List Page

Show requests for overseas/custom items.

Columns:

request ID
customer
item name
quantity
request date
status
assigned staff
actions

Statuses:

pending
under review
approved
rejected
converted to order

Actions:

review
approve
reject
convert to order
13.2 Request Details / Review Page

Show:

customer details
product/request information
images if any
notes
internal review notes
pricing decision
convert to order action
14. ORDER MANAGEMENT MODULE
14.1 Orders List Page

Show:

order number
customer
order type
source: shop / admin / request
total amount
amount paid
balance
status
delivery type
date
actions

Filters:

order type
status
payment status
delivery type
date range

Order types:

in-stock purchase
pre-order
installment order

Statuses:

pending
payment in progress
partially paid
fully paid
processing
ordered from supplier
in transit
arrived
ready for pickup
out for delivery
delivered
cancelled
refunded
14.2 Create Order Page

Use for staff-created orders.

Allow:

select existing customer
add custom item
add listed product
set order type
set quantity
set unit price
choose delivery type
mark installment requested yes/no
14.3 Order Details Page

Show:

customer info
order items
pricing summary
payment summary
balance
installment status
procurement info if overseas
delivery info
order timeline
internal notes
customer communication history
release item control

Actions:

record payment
update status
assign delivery
configure installment
release item
print receipt
send SMS

Important rule in UI:
Default item release is blocked until full payment, unless overridden by admin.

15. PAYMENT MANAGEMENT MODULE
15.1 Record Payment Modal/Page

Fields:

order
amount
payment method
transaction reference
payment date
notes

Methods:

momo
cash
bank transfer/manual transfer
15.2 Payment History Page

Show:

payment ID
order
customer
amount
method
automated/manual
reference
date
receipt action
15.3 Receipt View

Printable clean receipt design.

16. INSTALLMENT MANAGEMENT MODULE
16.1 Installments List Page

Show:

installment ID
order
customer
product/item
total amount
amount paid
balance
due date
grace period
status

Statuses:

requested
active
overdue
defaulted
completed
cancelled

Filters:

active
overdue
completed
defaulted
16.2 Configure Installment Plan Page

Used by staff after customer requests installment.

Fields:

linked order
total amount
initial payment
duration/term
due date
grace period
default penalty percentage
release rule
notes

Default rules:

fixed installment plan
held until fully paid by default
admin override allowed
30% deduction after grace period if customer defaults
16.3 Installment Details Page

Show:

customer
order
payment schedule summary
amount paid
balance
due date
grace period
status
payment history
reminder log
default/refund logic section

Actions:

add installment payment
send reminder
mark defaulted
process refund
complete plan
17. PROCUREMENT MODULE
17.1 Procurement List Page

Show:

procurement ID
linked order
supplier
item
purchase cost
shipping cost
status
urgency
expected arrival
actions

Statuses:

pending
ordered
shipped
in transit
arrived
closed
17.2 Procurement Details Page

Show:

order linkage
supplier details
purchase cost
shipping cost
total landed cost
expected vs actual arrival
notes
shipment timeline

Actions:

update status
attach supplier reference
add notes
17.3 Suppliers Page

Show:

supplier name
platform
contact info
active orders
performance notes
18. DELIVERY MANAGEMENT MODULE
18.1 Delivery List Page

Show:

delivery ID
order
customer
assigned delivery person
method
address
delivery status
date

Statuses:

awaiting assignment
assigned
in transit
delivered
failed
18.2 Delivery Details Page

Show:

order info
customer info
address
contact number
assigned personnel
timeline
proof of delivery placeholder

Actions:

assign delivery
update status
mark delivered
19. FINANCE & CASH FLOW MODULE

This is very important.

19.1 Finance Dashboard Page

Show summary cards:

total invested capital
total loans received
total customer payments received
total expenditure
gross profit
net profit
available business funds

Also show:

cash flow trend chart
inflow vs outflow chart
finance approvals pending
recent finance entries
recent expenditures

Filters:

day
week
month
year
custom range
19.2 Funds In Page

Show and manage all approved and pending inflow records.

Source types:

business capital
loan
shares/investment contribution
customer pre-order payment
other income

Fields per record:

date
source type
amount
source reference/name
automated/manual
linked order if applicable
approval status
recorded by
approved by
notes

Actions:

add record
edit
submit for approval
approve/reject

Important logic to reflect in UI:

automated momo payments can appear automatically
manual payments or other transfers are entered manually
19.3 Expenditure Page

Show:

expense ID
date
purpose
category
amount
spending officer
recorded by
approval status
approved by

Categories:

stock purchase
shipping
clearing
transport
office/admin
salary/allowance
refund
loan repayment
miscellaneous

Actions:

add expenditure
edit
submit for approval
approve/reject
view details
19.4 Finance Entry Details Page

Show:

full record details
related references
approval workflow
notes/history
19.5 Loan Records Page

Show:

loan source/lender
amount received
date received
due date
amount repaid
outstanding balance
status

Statuses:

active
partially repaid
fully repaid

Actions:

add loan
view repayment history
19.6 Cash Flow Summary Page

Show:

total inflow
total outflow
available business funds
trend chart
breakdown by category/source
20. REPORTS & ANALYTICS MODULE
20.1 Reports Home

Display report categories as cards:

sales reports
order reports
installment reports
stock reports
procurement reports
finance reports
profit reports
20.2 Sales Reports Page

Charts and tables for:

sales by period
sales by product
sales by order type
top customers
20.3 Profit Reports Page

Show:

gross profit
net profit
profit per item
profit by category
profit trend

Important note:
Cancelled or refunded orders should reduce sales/profit automatically.

20.4 Installment Reports Page

Show:

active plans
overdue plans
completed plans
defaulted plans
outstanding balances
20.5 Stock Reports Page

Show:

stock levels
low stock
best-selling products
20.6 Finance Reports Page

Show:

funds introduced
expenditures
loan report
loan repayment report
cash flow summary
available funds report
21. STAFF & ROLE MANAGEMENT MODULE
21.1 Staff Users Page

Show:

name
role
status
email/phone
last login

Actions:

add user
edit user
deactivate user
reset password
21.2 Roles & Permissions Page

Show role cards or table.

Roles:

admin
accounts officer
accounts head
sourcing officer
order manager
delivery personnel

Allow permission matrix UI.

Important approval rule:

finance and expenditure approvals can be done by Admin and Accounts Head
22. NOTIFICATIONS MODULE
22.1 Notifications Page

Show sent and scheduled notifications.

Types:

payment received
installment reminder
grace period warning
order ready
request update

Include SMS status and logs.

23. SETTINGS MODULE
23.1 System Settings

Sections:

company details
logo
contact info
SMS API settings
payment settings
installment policy settings
default grace period
penalty percentage
delivery settings
24. INTERACTION AND UX RULES

Apply these behaviors throughout the UI:

clear status badges
confirmation modals for critical actions
empty states for no data
loading states
success/error alerts
breadcrumbs on internal pages
responsive tables/cards
search and filters on every major listing page
export buttons for reports
print-friendly receipt and invoice views
25. IMPORTANT BUSINESS RULES TO REFLECT IN UI
in-stock items can be added to cart and checked out directly
overseas items should use request flow
installment is requested by customer but configured by staff
item release is blocked until fully paid by default
admin can override release
stock should reflect local inventory
automated momo payments can feed records automatically
manual payments need manual record entry
expenditures require approval
finance inflow records may require approval
only approved finance/expenditure records affect dashboard and reports
cancelled and refunded orders must affect financial summaries
loans must track amount received, repayment progress, and outstanding balance
26. OUTPUT REQUEST TO UI GENERATOR

Generate a complete UI system for all modules above.

Required output
all page designs
desktop and mobile responsive views
dashboard screens
data tables
forms
modals
charts
detail pages
login/register pages
e-commerce screens
admin screens
customer dashboard screens
Design quality expectations
highly polished
production-grade feel
modern SaaS/admin + e-commerce hybrid design
strong usability
consistency across all modules
Optional extra request

Also generate:

sidebar navigation design
topbar
reusable cards
reusable table styles
reusable form styles
modal designs
status badge system
timeline/progress components