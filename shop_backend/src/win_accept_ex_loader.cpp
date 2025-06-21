#include <winsock2.h>
#include <mswsock.h>   // for GUIDs
#include <ws2tcpip.h>  // for SOCKET etc
#include <iostream>

// Rename pointers to avoid conflict
LPFN_ACCEPTEX pAcceptEx = nullptr;
LPFN_GETACCEPTEXSOCKADDRS pGetAcceptExSockaddrs = nullptr;

bool LoadAcceptExFunctions(SOCKET sock)
{
    DWORD bytes = 0;

    GUID acceptex_guid = WSAID_ACCEPTEX;
    if (SOCKET_ERROR == WSAIoctl(
        sock,
        SIO_GET_EXTENSION_FUNCTION_POINTER,
        &acceptex_guid,
        sizeof(acceptex_guid),
        (LPVOID*)&pAcceptEx, // cast to pointer to void*
        sizeof(pAcceptEx),
        &bytes,
        NULL,
        NULL))
    {
        std::cerr << "Failed to load AcceptEx: " << WSAGetLastError() << "\n";
        return false;
    }

    GUID getacceptexsockaddrs_guid = WSAID_GETACCEPTEXSOCKADDRS;
    if (SOCKET_ERROR == WSAIoctl(
        sock,
        SIO_GET_EXTENSION_FUNCTION_POINTER,
        &getacceptexsockaddrs_guid,
        sizeof(getacceptexsockaddrs_guid),
        (LPVOID*)&pGetAcceptExSockaddrs, // cast to pointer to void*
        sizeof(pGetAcceptExSockaddrs),
        &bytes,
        NULL,
        NULL))
    {
        std::cerr << "Failed to load GetAcceptExSockaddrs: " << WSAGetLastError() << "\n";
        return false;
    }

    return true;
}
