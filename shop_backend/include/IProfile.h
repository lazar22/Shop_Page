//
// Created by Lazar on 6/24/2025.
//
#ifndef IPROFILE_H
#define IPROFILE_H

class IProfile
{
public:
    virtual std::string profile_login(std::string _email, std::string _password) = 0;

    virtual bool profile_register(std::string _name, std::string _email, std::string _password,
                                  std::string _lastname) = 0;

    virtual bool profile_delete(std::string _email, std::string _password) = 0;

    virtual bool profile_state(const std::string& _token) = 0;

    virtual bool verify_token(const std::string& _token) = 0;

    virtual std::string get_email_from_token(const std::string& _token) = 0;

    virtual std::string generate_token(const std::string& _email) = 0;

    virtual ~IProfile() = default;
};

#endif //IPROFILE_H
