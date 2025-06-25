//
// Created by Lazar on 6/24/2025.
//

#ifndef PROFILE_H
#define PROFILE_H

#include "IProfile.h"
#include "json.hpp"

#include <filesystem>
#include <iostream>
#include <fstream>
#include <string>

static const std::string folder = "../private/";
static const std::string filename = folder + "users.json";

class Profile final : public IProfile
{
public:
    Profile()
    {
        std::cout << "Looking for users.json at: " << std::filesystem::absolute(filename) << std::endl;
        if (!std::filesystem::exists(folder))
        {
            std::filesystem::create_directories(folder);
        }

        if (!std::filesystem::exists(filename))
        {
            std::ofstream ofs(filename);
            nlohmann::json _json;
            _json["users"] = nlohmann::json::array();
            ofs << _json.dump(4);
            ofs.close();
            std::cout << "Created new users.json file.\n" << std::endl;
        }
    }

    bool profile_register(const std::string _name, const std::string _email,
                          const std::string _password, const std::string _lastname) override
    {
        bool status{true};

        std::ifstream ifs(filename);
        if (!ifs.is_open())
        {
            std::cerr << "Failed to open " << filename << " for reading\n";
            status = false;
        }

        nlohmann::json _json;
        try
        {
            ifs >> _json;
        }
        catch (const std::exception& e)
        {
            std::cerr << "JSON parse error: " << e.what() << "\n";
            status = false;
        }
        ifs.close();

        // Ensure users key exists and is an array
        if (!_json.contains("users") || !_json["users"].is_array())
        {
            _json["users"] = nlohmann::json::array();
        }

        if (!check_for_email(_email, _json))
        {
            std::cerr << "User already exists.\n";
            status = false;
        }

        int new_id = get_last_id(_json) + 1;
        nlohmann::json new_user = {
            {"id", new_id},
            {"username", _name},
            {"lastname", _lastname},
            {"email", _email},
            {"password", _password}
        };

        _json["users"].push_back(new_user);

        // Open file for writing
        std::ofstream ofs(filename);
        if (!ofs.is_open())
        {
            std::cerr << "Failed to open " << filename << " for writing\n";
            status = false;
        }

        ofs << _json.dump(4);
        ofs.flush();
        ofs.close();

        std::cout << "Registered new user.\n" << std::endl;
        return status;
    }

    bool profile_login(const std::string _email, const std::string _password) override
    {
        std::ifstream ifs(filename);
        nlohmann::json _json;

        ifs >> _json;
        ifs.close();

        for (const auto& user : _json["users"])
        {
            if (user["email"] == _email && user["password"] == _password)
            {
                return true;
            }
        }
        return false;
    }

    bool profile_logout() override
    {
        return true;
    }

    bool profile_delete(std::string _email, std::string _password) override
    {
        return true;
    }

protected:
    static int get_last_id(const nlohmann::json& _json)
    {
        int max_id = 0;
        for (const auto& user : _json["users"])
        {
            if (user.contains("id") && user["id"].is_number_integer())
            {
                max_id = std::max(max_id, user["id"].get<int>());
            }
        }
        return max_id;
    }

    static bool check_for_email(const std::string& _email, const nlohmann::json& _json)
    {
        for (const auto& user : _json["users"])
        {
            if (_email == user["email"].get<std::string>())
            {
                return false;
            }
        }
        return true;
    }
};

#endif //PROFILE_H
