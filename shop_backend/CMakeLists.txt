CMAKE_MINIMUM_REQUIRED(VERSION 3.14)

PROJECT(SHOP VERSION 1)

add_executable(shop src/main.cpp)

target_link_directories(shop PRIVATE include lib)