#ifndef ICART_H
#define ICART_H

#pragma once

#include <vector>
#include <string>
#include <memory>

class ICart
{
public:
    virtual ~ICart() = default;

    virtual void add_item(const int item_id, const int price, const int quantity = 1) = 0;

    virtual void remove_item(const int item_id) = 0;

    [[nodiscard]] virtual int get_total_price() const = 0;

    [[nodiscard]] virtual int get_item_count() const = 0;

    [[nodiscard]] virtual std::vector<std::pair<int, int>> get_items() const = 0;
};

#endif //ICART_H
