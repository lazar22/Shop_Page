//
// Created by Lazar on 6/26/2025.
//

#ifndef IWISHLIST_H
#define IWISHLIST_H
#include <vector>

class IWishlist
{
public:
    virtual ~IWishlist() = default;

    virtual void add_to_wishlist(const std::string& email, int item_id) = 0;

    virtual void remove_from_wishlist(const std::string& _email, int item_id) = 0;

    virtual std::vector<int> get_wishlist(const std::string& email) const = 0;

    virtual bool is_in_wishlist(const std::string& email, int item_id) const = 0;
};

#endif //IWISHLIST_H
