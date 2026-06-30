from fastapi import status
from typing import Optional, Dict, Any

class AppBaseException(Exception):
    """Excepción base para toda la aplicación"""

    def __init__(self, message: str, status_code: int, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.status_code = status_code
        self.message = message

        super().__init__(self.message)

class NotFoundException(AppBaseException):
    """Error cuando un recurso (tarea, etiqueta) no existe"""

    def __init__(self, message: str = "Recurso no encontrado", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, message=message, details=details)


class ForbiddenException(AppBaseException):
    """Error de permisos de acceso"""

    def __init__(self, message: str = "No tienes permisos para realizar esta acción", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN, details=details)


class UnauthorizedException(AppBaseException):
    def __init__(self, message: str = "Credenciales inválidas o token ausente", details: Optional[Dict[str, Any]] = None):
        super().__init__(status.HTTP_401_UNAUTHORIZED, message, details=details)
