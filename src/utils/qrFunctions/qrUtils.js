import { API_BASE_URL } from "../../config";

// Función para guardar los datos del Formulario del QR
export const saveQRData = async (formData, qrData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/qr/save-qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        qrData,
      }),
    });

    if (response.ok) {
      alert("Datos guardados correctamente.");
    } else {
      alert("Error al guardar los datos.");
    }
  } catch (error) {
    console.error("Error al guardar los datos:", error);
  }
};

//Funcion para modificar o actualizar los datos del formulario del QR
export const updateQrData = async (formData, token, navigate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/qr/update/${formData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Error actualizando el QR");
    }

    alert("QR actualizado correctamente");
    navigate("/datatable");
  } catch (error) {
    console.error("Error:", error);
    alert("Error actualizando el QR");
  }
};

//Funcion para eliminar los datos en la tabla de activos del QR
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
        return qrData.filter((item) => item._id !== id);
      } else {
        alert("Error al eliminar el Activo");
      }
    } catch (error) {
      console.error("Error eliminando QR:", error);
      alert("Hubo un error al intentar eliminar el Activo");
    }
  };

  