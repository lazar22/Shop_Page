#ifndef CART_H
#define CART_H

#include <unordered_map>

#include "ICart.h"

class Cart final : public ICart
{
    std::pmr::unordered_map<int, int> items;
    int total_price{0};

public:
    void add_item(const int item_id, const int price, const int quantity = 1) override
    {
        items[item_id] += quantity;
        total_price += (price * quantity);
    }

    void remove_item(const int item_id, const int price, const int quantity = 1) override
    {
        if (items.count(item_id))
        {
            total_price -= price * quantity;
            items.erase(item_id);
        }
    }

    int get_total_price() const override
    {
        return total_price;
    }

    int get_item_count() const override
    {
        return items.size();
    }

    std::vector<std::pair<int, int>> get_items() const override
    {
        std::vector<std::pair<int, int>> result;

        for (const auto& [id, qty] : items)
        {
            result.emplace_back(id, qty);
        }
        return result;
    }
};

#endif
