# Shop_Page

Simple Website using Angular as Frontend and C++ as a Backend

## Frontend

Frontend is an angular project that uses angular routing system,
and it's connected to
backend using the http communication

It's a multipage website with currently 3 pages working,
including home_page, cart_page and 404 page

## Backend

Backend is a C++ file that uses ICart.h as a purely virtual function,
and Cart.h as a derivative function from ICart that handles
adding, removing, getting (size and total price) from items in the cart

In future its planned to add purely virtual class IUser.h and derivative class User.h
that will handle the login and register information (it will probably not be protected)

Backend is using Crow as a host for posting and receiving data on [ 4000 ] port. <br>
Routers are: <br>
['/cart/add', '/cart/get_item_count', '/cart/get_total_price', '/cart/remove_item', '/cart/get_items']