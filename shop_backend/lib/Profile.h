//
// Created by Lazar on 6/24/2025.
//

#ifndef PROFILE_H
#define PROFILE_H

#define JSON_NOEXCEPTION

#include "IProfile.h"
#include "json.hpp"
#include "crypto_util.h"

#include <jwt-cpp/jwt.h>
#include <filesystem>
#include <iostream>
#include <fstream>
#include <string>
#include <chrono>

static const std::string folder = "../private/";
static const std::string filename = folder + "users.json";

static const std::string jwt_secret = "verylongandsecuredseecret";

class Profile final : public IProfile
{
    std::unordered_map<std::string, bool> login_states;

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

    std::string generate_token(const std::string& _email) override
    {
        auto _token = jwt::create()
                      .set_issuer("Shop_Page")
                      .set_type("JWT")
                      .set_payload_claim("email", jwt::claim(_email))
                      .set_issued_at(std::chrono::system_clock::now())
                      .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours(24))
                      .sign(jwt::algorithm::hs256{jwt_secret});

        return _token;
    }

    bool verify_token(const std::string& _token) override
    {
        try
        {
            const auto decoded = jwt::decode(_token);
            const auto verifier = jwt::verify()
                                  .allow_algorithm(jwt::algorithm::hs256{jwt_secret})
                                  .with_issuer("Shop_Page");

            verifier.verify(decoded);
            return true;
        }
        catch (std::exception& e)
        {
            std::cerr << "Token verification  failed: " << e.what() << std::endl;
            return false;
        }
    }

    std::string get_email_from_token(const std::string& _token) override
    {
        try
        {
            auto decoded = jwt::decode(_token);
            return decoded.get_payload_claim("email").as_string();
        }
        catch (...)
        {
            return "";
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

        if (!_json.contains("users") || !_json["users"].is_array())
        {
            _json["users"] = nlohmann::json::array();
        }

        if (!check_for_email(_email, _json))
        {
            std::cerr << "User already exists.\n";
            status = false;
        }

        if (status)
        {
            std::string encrypted_email = CryptoUtil::encrypt(_email);
            std::string encrypted_password = CryptoUtil::encrypt(_password);

            int new_id = get_last_id(_json) + 1;

            nlohmann::json new_user = {
                {"id", new_id},
                {"username", _name},
                {"lastname", _lastname},
                {"email", encrypted_email},
                {"password", encrypted_password}
            };

            _json["users"].push_back(new_user);

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
            std::string token = generate_token(_email);

            profile_login(_email, _password);
        }

        return status;
    }

    std::string profile_login(const std::string _email, const std::string _password) override
    {
        std::string token{""};
        std::ifstream ifs(filename);
        if (!ifs.is_open())
        {
            std::cerr << "Failed to open users file\n";
            return token;
        }

        nlohmann::json _json;
        try
        {
            ifs >> _json;
        }
        catch (const std::exception& e)
        {
            std::cerr << "JSON parse error: " << e.what() << "\n";
            return token;
        }

        for (const auto& user : _json["users"])
        {
            try
            {
                const std::string decrypted_email = CryptoUtil::decrypt(user["email"].get<std::string>());
                const std::string decrypted_password = CryptoUtil::decrypt(user["password"].get<std::string>());

                if (decrypted_email == _email && decrypted_password == _password)
                {
                    login_states[_email] = true;
                    token = generate_token(_email);
                    break;
                }
            }
            catch (const std::exception& e)
            {
                std::cerr << "Error decrypting user data: " << e.what() << std::endl;
                continue;
            }
        }

        if (token.empty())
        {
            std::cerr << "Login failed for user: " << _email << std::endl;
        }

        return token;
    }


    bool profile_delete(std::string _email, std::string _password) override
    {
        return true;
    }

    bool profile_state(const std::string& _token) override
    {
        return verify_token(_token);
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
            const std::string decrypted_email = CryptoUtil::decrypt(user["email"]);

            if (_email == decrypted_email)
            {
                return false;
            }
        }
        return true;
    }
};

#endif //PROFILE_H
