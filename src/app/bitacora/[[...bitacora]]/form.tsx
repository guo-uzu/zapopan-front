"use client"
import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Combobox } from './combobox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Inputs } from '@/hooks/types'
import { sendDataSupabase } from '@/utils/sendData'

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
  {
    value: "solicitudes_especiales",
    label: "Solicitudes especiales",
  },
  {
    value: "reporte_inspeccion_vigilancia",
    label: "Reporte de inspección y vigilancia",
  },
  {
    value: "reportes_denuncias",
    label: "Reportes y denuncias",
  },
  {
    value: "solicitud_empleo",
    label: "Solicitud de empleo",
  },
  {
    value: "coyuntura",
    label: "Coyuntura",
  },
  {
    value: "participacion_curso",
    label: "Participación en curso",
  },
  {
    value: "solicitud_obra",
    label: "Solicitud de obra",
  },
  {
    value: "otros",
    label: "Otros",
  },
]

const area: DataCombox[] = [
  {
    value: "infraestructura_comercio",
    label: "Infraestructura de comercio",
  },
  {
    value: "servicios_municipales",
    label: "Servicios municipales",
  },
  {
    value: "gestion_integral",
    label: "Gestión integral",
  },
  {
    value: "secretaria_ayuntamiento",
    label: "Secretaría del ayuntamiento",
  },
  {
    value: "desarrollo_economico",
    label: "Desarrollo económico",
  },
  {
    value: "construccion_comunidad",
    label: "Construcción comunidad",
  },
  {
    value: "dif",
    label: "DIF",
  },
  {
    value: "tesoreria",
    label: "Tesorería",
  },
  {
    value: "cfe",
    label: "CFE",
  },
  {
    value: "siapa",
    label: "SIAPA",
  },
  {
    value: "siop",
    label: "SIOP",
  },
  {
    value: "otras_coordinaciones",
    label: "Otras coordinaciones",
  },
  {
    value: "otras_dependencias_estatales",
    label: "Otras dependencias estatales",
  },
  {
    value: "presidencia",
    label: "Presidencia",
  },
  {
    value: "guadalajara",
    label: "Guadalajara",
  },
  {
    value: "inspeccion_vigilancia",
    label: "Inspección y vigilancia",
  },
  {
    value: "pcyb",
    label: "PCyB",
  },
  {
    value: "cercania_ciudadana",
    label: "Cercanía ciudadana",
  },
  {
    value: "salud_zapopan",
    label: "Salud Zapopan",
  },
  {
    value: "comisaria",
    label: "Comisaría",
  },
  {
    value: "comude",
    label: "COMUDE",
  },
  {
    value: "caec",
    label: "CAEC (Boletos Charros)",
  },
  {
    value: "sindicatura",
    label: "Sindicatura",
  },
  {
    value: "administracion_inovacion_gubernamental",
    label: "Administración e Innovación Gubernamental",
  },
  {
    value: "amim",
    label: "AMIM",
  },
  {
    value: "cursos_parque_ninas_ninos",
    label: "Cursos en el Parque de las niñas y  niños",
  },
  {
    value: "romeria",
    label: "Romería",
  },
  {
    value: "contraloria_ciudadana",
    label: "Contraloría ciudadana",
  }
]

const prioridad: DataCombox[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" }
]

const estatus: DataCombox[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En proceso" },
  { value: "resuelto", label: "Resuelto" }
]

export default function Form() {
  const { register, handleSubmit, control, reset } = useForm<Inputs>()

  const saveData: SubmitHandler<Inputs> = async (dataForm) => {
    const response = await sendDataSupabase(dataForm)
    if (response) reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Formulario de bitácora</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(saveData)}>
          <div className='flex flex-col gap-6'>
            <div className="grid gap-3">
              <Label htmlFor='name'>Nombre</Label>
              <Input {...register("name")} id='name' type='text' name='name' />
            </div>
            <div className='grid grid-cols-2'>
              <div className="grid gap-3">
                <Label htmlFor='account'>Cuenta</Label>
                <Controller
                  name="account"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Combobox
                      data={cuentas}
                      onChange={onChange} />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='chanel'>Canal</Label>
                <Controller
                  name="chanel"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Combobox
                      data={canal}
                      onChange={onChange} />
                  )}
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor='username'>Nombre de usuario</Label>
              <Input {...register("username")} id='username' type='text' name='username' />
            </div>
            <div className="grid gap-3">
              <Label htmlFor='link'>Enlace a perfil/publicación</Label>
              <Input {...register("link")} id='link' type='text' name='link' />
            </div>
            <div className='grid grid-cols-2'>
              <div className="grid gap-3">
                <Label htmlFor='category'>Categoría</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Combobox
                      data={categoria}
                      onChange={onChange} />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='area_responsable'>Área responsable</Label>
                <Controller
                  name="area_responsable"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Combobox
                      data={area}
                      onChange={onChange} />
                  )} />
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor='description'>Descripción</Label>
              <Textarea {...register("description")} id='description' name='description' placeholder='Escribe la descripción aquí...' />
            </div>
            <div className="grid gap-3">
              <Label htmlFor='colonia'>Colonia</Label>
              <Input {...register("colonia")} id='colonia' type='text' name='colonia' />
            </div>
            <div className='grid grid-cols-2'>
              <div className="grid gap-3">
                <Label htmlFor='priority'>Prioridad</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Combobox
                      data={prioridad}
                      onChange={onChange} />
                  )} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='status'>Estatus</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Combobox
                      data={estatus}
                      onChange={onChange} />
                  )} />
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor='direction'>Dirección</Label>
              <Input {...register("direction")} id='direction' type='text' name='direction' />
            </div>
            <div className="grid gap-3">
              <Label htmlFor='folio'>Folio</Label>
              <Input {...register("folio")} id='folio' type='text' name='folio' />
            </div>
            <div className="grid gap-3">
              <Label htmlFor='observations'>Observaciones y comentarios</Label>
              <Textarea {...register("observations")} id='observations' name='observations' placeholder='Escribe las observaciones y comentarios aquí...' />
            </div>
            <div className='grid gap-3'>
              <Button type='submit' className='w-full'>Guardar</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
