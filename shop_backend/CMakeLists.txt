cmake_minimum_required(VERSION 3.14)

project(SHOP VERSION 1)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)

find_package(asio CONFIG REQUIRED)
find_package(cryptopp CONFIG REQUIRED)

add_executable(shop
        src/main.cpp
        lib/Cart.h
        lib/Profile.h
        src/win_accept_ex_loader.cpp
        lib/crypto_util.h
        include/env_loader.h)

target_link_libraries(shop PRIVATE
        asio::asio
        ws2_32
        Mswsock
        cryptopp::cryptopp
)

target_include_directories(shop PRIVATE
        "C:/Users/Lazar/crow/include"
        include
        lib
)

add_definitions(-DENV_PATH=\"${CMAKE_SOURCE_DIR}/../.env\")