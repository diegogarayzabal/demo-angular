# Sistema de Gestión para Estudio Jurídico – Demo en Angular

Este proyecto es una demostración de un sistema desarrollado en **Angular** para un estudio jurídico.  
Permite registrar **visitas al estudio**, llevar una base de **casos**, y gestionar **etapas internas** del proceso.  
El objetivo del repositorio es mostrar organización, arquitectura, estructura de componentes y capacidad de desarrollo en Angular para fines de evaluación técnica.

---

## 🚀 Tecnologías utilizadas

- **Angular (12 → 19)**  
- **TypeScript**  
- **HTML / SCSS**  
- **Angular Router**  
- **Programación modular**  
- **Servicios con RxJS**  
- **Standalone Components**  
- **Arquitectura escalable**  

---

## 📌 Funcionalidades principales

### ✔ Registro de visitas al estudio  
- Carga manual de visitas  
- Fecha, persona, motivo  
- Listado con filtros rápidos

### ✔ Gestión simple de casos  
- Alta de casos  
- Datos básicos del cliente  
- Tipo de caso  
- Estado general  
- Observaciones

### ✔ Seguimiento de etapas del caso  
- Registro de cada etapa  
- Edición y eliminación  
- Control visual del avance  
- Orden cronológico

### ✔ Componentes reutilizables  
- Inputs personalizados  
- Selects dinámicos  
- Paginador  
- Filtros  
- Tablas responsivas  
- Componente para visualización de PDFs  
- Botones, íconos SVG, badges de estado

### ✔ Servicios  
- Manejo de datos  
- Funciones utilitarias  
- Componentes auxiliares  
- Pipes de búsqueda y filtrado

---

## 📂 Estructura general del proyecto

src/
├── app/
│ ├── login/
│ ├── opciones/
│ │ ├── menu-casos/
│ │ ├── menu-casos-nuevo/
│ │ ├── menu-visitas/
│ │ ├── menu-visitas-nueva/
│ ├── componentes/
│ ├── tuberias/
│ ├── utilidades/
│ ├── configuracion/
│ ├── funciones.service.ts
│ ├── pdfs.service.ts
│ ├── globales.ts
│
├── assets/
├── environments/
├── index.html
├── styles.scss


---

## 🛠 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/diegogarayzabal/demo-angular.git

🔒 Seguridad

Este repositorio contiene únicamente código frontend
No incluye archivos PHP ni configuraciones privadas del sistema real.
Carpetas sensibles fueron excluidas mediante .gitignore.

🎯 Objetivo del repositorio

Mostrar conocimientos prácticos en Angular

Presentar un ejemplo funcional y organizado

Permitir evaluación por reclutadores y equipos técnicos

Exponer buenas prácticas de modularidad y arquitectura

👨‍💻 Autor

Diego Garayzabal
Senior Full-Stack Developer
Angular • PHP • MySQL • Arquitectura de Software
LinkedIn: https://linkedin.com/in/diego-garayzabal

📄 Licencia

Proyecto publicado únicamente con fines demostrativos.
