cmake_minimum_required(VERSION 3.14)

project(SHOP VERSION 1)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)
find_package(asio CONFIG REQUIRED)

add_executable(shop
        src/main.cpp
        lib/Cart.h
        src/win_accept_ex_loader.cpp)

target_link_libraries(shop PRIVATE
        asio::asio
        ws2_32
        Mswsock
)

target_include_directories(shop PRIVATE
        "C:/Users/Lazar/crow/include"
        include
        lib
)
