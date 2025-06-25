//
// Created by Lazar on 6/24/2025.
//
#ifndef IPROFILE_H
#define IPROFILE_H

class IProfile
{
public:
    virtual bool profile_login(std::string _email, std::string _password) = 0;

    virtual bool profile_register(std::string _name, std::string _email, std::string _password,
                                  std::string _lastname) = 0;

    virtual bool profile_logout() = 0;

    virtual bool profile_delete(std::string _email, std::string _password) = 0;

    virtual ~IProfile() = default;
};

#endif //IPROFILE_H
