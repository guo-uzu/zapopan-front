import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Combobox } from './combobox'

interface DataCombox {
  value: string,
  label: string
}

const cuentas: DataCombox[] = [
  {
    value: "zapopan",
    label: "Gob de Zapopan",
  },
  {
    value: "jjf",
    label: "JJF",
  }
]

const canal: DataCombox[] = [
  {
    value: "coment",
    label: "Comentarios", 
  },
  {
    value: "inbox",
    label: "Inbox",
  }
]

const categoria: DataCombox[] = [
  {
    value: "solicitud_informacion",
    label: "Solicitud de información",
  },
  {
    value: "canalizacion_dependencia",
    label: "Canalización a dependencia",
  },
  {
    value: "solicitudes_nuevas",
    label: "Solicitudes nuevas",
  },
  {
    value: "reportes_servicios",
    label: "Reportes de servicios",
  },
  {
    value: "reporte_obras",
    label: "Reportes de obras",
  },
  {
    value: "reporte_externos",
    label: "Reportes externos",
  },
]

export default function Form() {
  return (
    <form action="">
        <div>
            <Label htmlFor='name'>Nombre</Label>
            <Input id='name' type='text' name='name' />
        </div>
        <div>
            <Label htmlFor='account'>Cuenta</Label>
            <Combobox data={cuentas}/>
        </div>
        <div>
          <Label htmlFor='chanel'>Canal</Label>
          <Combobox data={canal}/>
        </div>
        <div>
          <Label htmlFor='username'>Nombre de usuario</Label>
          <Input id='username' type='text' name='username' />
        </div>
        <div>
          <Label htmlFor='link'>Enlace a perfil/publicación</Label>
          <Input id='link' type='text' name='link' />
        </div>
        <div>
          <Label htmlFor='date'>Fecha de la solicitud</Label>
          <Input id='date' type='date' name='date' />
        </div>
        <div>
          <Label htmlFor='category'>Categoría</Label>
          <Combobox data={categoria}/>
        </div>
    </form>
  )
}
