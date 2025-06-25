//
// Created by Lazar on 6/25/2025.
//
#ifndef CRYPTO_UTIL_H
#define CRYPTO_UTIL_H

#include <iostream>

#include "env_loader.h"

#include <string>

#include <cryptopp/filters.h>
#include <cryptopp/base64.h>
#include <cryptopp/modes.h>
#include <cryptopp/hex.h>
#include <cryptopp/aes.h>

static std::string AES_KEY;
static std::string AES_IV;

class CryptoUtil
{
public:
    static void init(const std::string& _env_path)
    {
        auto env = ENVLOADER::load(_env_path);

        AES_KEY = env["AES_KEY"];
        AES_IV = env["AES_IV"];
    }

    static std::string encrypt(const std::string& _plain)
    {
        std::string cipher_txt;
        CryptoPP::AES::Encryption aes_encryption(
            reinterpret_cast<const CryptoPP::byte*>(AES_KEY.data()), AES_KEY.size());
        CryptoPP::CBC_Mode_ExternalCipher::Encryption cbc_encryption(aes_encryption,
                                                                     reinterpret_cast<const CryptoPP::byte*>
                                                                     (AES_IV.data()));
        CryptoPP::StreamTransformationFilter stream_encryption(cbc_encryption, new CryptoPP::StringSink(cipher_txt));

        stream_encryption.Put(reinterpret_cast<const unsigned char*>(_plain.c_str()),
                              _plain.length());
        stream_encryption.MessageEnd();

        std::string base64_output;
        CryptoPP::StringSource ss(cipher_txt, true,
                                  new CryptoPP::Base64Encoder(new CryptoPP::StringSink(base64_output), false));
        return base64_output;
    }

    static std::string decrypt(const std::string& _hex_cipher)
    {
        std::string cipher_bytes;
        CryptoPP::StringSource ss(_hex_cipher, true,
                                  new CryptoPP::Base64Decoder(new CryptoPP::StringSink(cipher_bytes)));

        std::string decrypted;
        CryptoPP::AES::Decryption aes_decryption(
            reinterpret_cast<const CryptoPP::byte*>(AES_KEY.data()), AES_KEY.size());

        CryptoPP::CBC_Mode_ExternalCipher::Decryption cbc_decryption(aes_decryption,
                                                                     reinterpret_cast<const CryptoPP::byte*>(AES_IV.
                                                                         data()));

        CryptoPP::StreamTransformationFilter stream_decryption(cbc_decryption,
                                                               new CryptoPP::StringSink(decrypted));

        stream_decryption.Put(reinterpret_cast<const unsigned char*>(cipher_bytes.c_str()),
                              cipher_bytes.size());
        stream_decryption.MessageEnd();

        return decrypted;
    }

private:
    static std::string from_hex(const std::string& _str)
    {
        std::string output;
        CryptoPP::StringSource ss(_str, true, new CryptoPP::HexDecoder(new CryptoPP::StringSink(output)));
        return output;
    }

    static std::string to_hex(const std::string& _str)
    {
        std::string output;
        CryptoPP::StringSource ss(_str, true, new CryptoPP::HexEncoder(new CryptoPP::StringSink(output)));
        return output;
    }
};

#endif //CRYPTO_UTIL_H
