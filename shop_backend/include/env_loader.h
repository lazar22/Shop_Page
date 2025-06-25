//
// Created by Lazar on 6/25/2025.
//

#ifndef ENV_LOADER_H
#define ENV_LOADER_H

#include <string>
#include <fstream>
#include <sstream>
#include <unordered_map>

class ENVLOADER
{
    static std::string trim(const std::string& str)
    {
        const auto start = str.find_first_not_of(" \t\r\n");
        const auto end = str.find_last_not_of(" \t\r\n");
        return (start == std::string::npos) ? "" : str.substr(start, end - start + 1);
    }

public:
    static std::unordered_map<std::string, std::string> load(const std::string& _path)
    {
        std::unordered_map<std::string, std::string> env_map;
        std::ifstream file(_path);
        std::string line;

        while (std::getline(file, line))
        {
            std::istringstream iss(line);
            std::string key, value;

            if (std::getline(iss, key, '=') && std::getline(iss, value))
            {
                env_map[trim(key)] = trim(value);
            }
        }

        return env_map;
    };
};

#endif //ENV_LOADER_H
