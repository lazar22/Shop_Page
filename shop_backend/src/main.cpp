#include "Cart.h"
#include "Profile.h"

#define CROW_MAIN
#define CROW_USE_STANDALONE_ASIO
#include "crow.h"

#ifndef ENV_PATH
#error "ENV_PATH is not defined. Make sure it's passed via CMake."
#endif

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

        if (req.method == crow::HTTPMethod::Options)
        {
            res.code = 204;
            res.end();
        }
    }

    void after_handle(crow::request&, crow::response& res, context&)
    {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
};

int main()
{
    crow::App<CORS> app;
    CryptoUtil::init(ENV_PATH);

    Cart cart;
    Profile profile;

    // Cart Routs
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

    CROW_ROUTE(app, "/cart/get_total_price").methods("GET"_method)([&cart]()
    {
        crow::json::wvalue response_body;
        response_body["total"] = cart.get_total_price();

        crow::response res{200};
        res.set_header("Content-Type", "application/json");
        res.write(response_body.dump());

        return res;
    });

    CROW_ROUTE(app, "/cart/remove_item").methods(crow::HTTPMethod::Post)([&cart](const crow::request& req)
    {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("item_id"))
        {
            return crow::response(400, "Invalid or missing item_id");
        }

        const int item_id = body["item_id"].i();
        const int item_quantity = body["quantity"].i();
        const int item_price = body["price"].i();

        cart.remove_item(item_id, item_price, item_quantity);

        crow::json::wvalue response_body;
        response_body["message"] = "Item removed!";

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

    // Profile Routs
    CROW_ROUTE(app, "/auth/register").methods(crow::HTTPMethod::Post)([&profile](const crow::request& req)
    {
        auto body = crow::json::load(req.body);
        if (!body)
        {
            return crow::response(400, "Invalid JSON");
        }

        const auto& user_obj = body;

        std::string name = user_obj["name"].s();
        std::string lastname = user_obj["lastname"].s();
        std::string email = user_obj["email"].s();
        std::string password = user_obj["password"].s();

        bool success = profile.profile_register(name, email, password, lastname);

        crow::json::wvalue response_body;
        response_body["success"] = success;
        response_body["message"] = success ? "Registered!" : "User already exists!";

        crow::response res{success ? 200 : 409};
        res.set_header("Content-Type", "application/json");
        res.write(response_body.dump());
        return res;
    });

    app.port(4000).multithreaded().run();
}
