import { API_BASE_URL } from "../../config";

export const deleteQRCode = async (id, token, qrData, setQrData) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este QR?"
    );
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${API_BASE_URL}/qr/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert("Activo eliminado correctamente");
        return qrData.filter((item) => item._id !== id); // Retorna la nueva lista de QR
      } else {
        alert("Error al eliminar el Activo");
      }
    } catch (error) {
      console.error("Error eliminando QR:", error);
      alert("Hubo un error al intentar eliminar el Activo");
    }
  };

  