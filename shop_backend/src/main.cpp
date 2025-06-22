#include "Cart.h"

#define CROW_MAIN
#define CROW_USE_STANDALONE_ASIO
#include "crow.h"

struct CORS
{
    struct context
    {
    };

    void before_handle(crow::request& req, crow::response& res, context&)
    {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight (OPTIONS) request
        if (req.method == crow::HTTPMethod::Options)
        {
            res.code = 204; // No Content
            res.end();
        }
    }

    void after_handle(crow::request&, crow::response& res, context&)
    {
        // Make sure CORS headers are always in the final response
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
};

int main()
{
    crow::App<CORS> app;
    Cart cart;

    CROW_ROUTE(app, "/cart/add").methods(crow::HTTPMethod::Post)([&cart](const crow::request& req)
    {
        auto body = crow::json::load(req.body);
        if (!body)
        {
            return crow::response(400, "Invalid JSON");
        }


        crow::json::wvalue response_body;

        int item_id = body["item_id"].i();
        int price = body["price"].i();
        int quantity = body["quantity"].i();

        response_body["message"] = "Item added!";
        response_body["item_id"] = item_id;
        response_body["price"] = price;
        response_body["quantity"] = quantity;

        cart.add_item(item_id, price, quantity);

        crow::response res{200};
        res.set_header("Content-Type", "application/json");
        res.write(response_body.dump());

        return res;
    });

    CROW_ROUTE(app, "/cart/get_item_count").methods("GET"_method)([&cart]()
    {
        crow::json::wvalue response_body;
        response_body["count"] = cart.get_item_count();

        crow::response res{200};
        res.set_header("Content-Type", "application/json");
        res.write(response_body.dump());

        return res;
    });

    CROW_ROUTE(app, "/cart/get_items").methods("GET"_method)([&cart]()
    {
        crow::json::wvalue response_body = crow::json::wvalue::list();

        auto items = cart.get_items();
        int index = 0;
        for (const auto& [id, qty] : items)
        {
            response_body[index]["id"] = id;
            response_body[index]["amount"] = qty;
            ++index;
        }

        crow::response res{200};
        res.set_header("Content-Type", "application/json");
        res.write(response_body.dump());

        return res;
    });

    app.port(4000).multithreaded().run();
}
