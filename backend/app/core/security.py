import socket
import ipaddress
from urllib.parse import urlparse
from fastapi import HTTPException

PRIVATE_IP_RANGES = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
]

def validate_url_security(url: str) -> str:
    """
    Validates that a given URL is publicly routable and not pointing to
    internal network subnets or loopback addresses (SSRF Protection).
    Returns sanitized URL string if valid; raises HTTPException(400) if unsafe.
    """
    target_url = url.strip()
    if not target_url.startswith(("http://", "https://")):
        target_url = f"https://{target_url}"

    try:
        parsed = urlparse(target_url)
        hostname = parsed.hostname

        if not hostname:
            raise HTTPException(status_code=400, detail="SSRF Guard: Invalid hostname in URL.")

        # Block literal localhost keywords
        if hostname.lower() in ["localhost", "0.0.0.0", "127.0.0.1", "::1"]:
            raise HTTPException(status_code=400, detail="SSRF Guard: Auditing localhost or loopback interfaces is restricted.")

        # DNS resolution check
        try:
            ip_str = socket.gethostbyname(hostname)
            ip_obj = ipaddress.ip_address(ip_str)

            for private_range in PRIVATE_IP_RANGES:
                if ip_obj in private_range:
                    raise HTTPException(
                        status_code=400,
                        detail=f"SSRF Guard: Target host resolves to a restricted private IP address ({ip_str})."
                    )
        except socket.gaierror:
            raise HTTPException(status_code=400, detail=f"SSRF Guard: Unable to resolve DNS for hostname '{hostname}'.")

        return target_url

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"SSRF Guard Validation Error: {str(e)}")