from fastapi import status

class AppBaseException(Exception):
    """Excepción base para toda la aplicación"""
    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class NotFoundException(AppBaseException):
    """Error cuando un recurso (tarea, etiqueta) no existe"""
    def __init__(self, message: str = "Recurso no encontrado"):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND)

class ForbiddenException(AppBaseException):
    """Error de permisos de acceso"""
    def __init__(self, message: str = "No tienes permisos para realizar esta acción"):
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN)