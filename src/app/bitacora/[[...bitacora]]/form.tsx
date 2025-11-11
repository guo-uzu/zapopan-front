"use client"
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { SelectItem, SelectContent, Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Inputs } from '@/hooks/types'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { sendDataSupabase } from '@/hooks/sendData'
import { toast } from 'sonner'
0
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
    value: "comentarios",
    label: "Comentarios",
  },
  {
    value: "inbox",
    label: "Inbox",
  }
]

const categoria: DataCombox[] = [
  {
    "value": "solicitud_de_información",
    "label": "Solicitud de información"
  },
  {
    "value": "canalización_a_dependencia",
    "label": "Canalización a dependencia"
  },
  {
    "value": "solicitudes_nuevas",
    "label": "Solicitudes nuevas"
  },
  {
    "value": "reportes_de_servicios",
    "label": "Reportes de servicios"
  },
  {
    "value": "reportes_de_obras",
    "label": "Reportes de obras"
  },
  {
    "value": "reportes_externos",
    "label": "Reportes externos"
  },
  {
    "value": "solicitudes_especiales",
    "label": "Solicitudes especiales"
  },
  {
    "value": "reporte_de_inspección_y_vigilancia",
    "label": "Reporte de inspección y vigilancia"
  },
  {
    "value": "reportes_y_denuncias",
    "label": "Reportes y denuncias"
  },
  {
    "value": "solicitud_de_empleo",
    "label": "Solicitud de empleo"
  },
  {
    "value": "coyuntura",
    "label": "Coyuntura"
  },
  {
    "value": "participación_en_curso",
    "label": "Participación en curso"
  },
  {
    "value": "solicitud_de_obra",
    "label": "Solicitud de obra"
  },
  {
    "value": "otros",
    "label": "Otros"
  }
]

const area: DataCombox[] = [
  {
    "value": "infraestructura_de_comercio",
    "label": "Infraestructura de comercio"
  },
  {
    "value": "servicios_municipales",
    "label": "Servicios municipales"
  },
  {
    "value": "gestión_integral",
    "label": "Gestión integral"
  },
  {
    "value": "secretaría_del_ayuntamiento",
    "label": "Secretaría del ayuntamiento"
  },
  {
    "value": "desarrollo_económico",
    "label": "Desarrollo económico"
  },
  {
    "value": "construcción_comunidad",
    "label": "Construcción comunidad"
  },
  {
    "value": "dif",
    "label": "DIF"
  },
  {
    "value": "tesorería",
    "label": "Tesorería"
  },
  {
    "value": "cfe",
    "label": "CFE"
  },
  {
    "value": "siapa",
    "label": "SIAPA"
  },
  {
    "value": "siop",
    "label": "SIOP"
  },
  {
    "value": "otras_coordinaciones",
    "label": "Otras coordinaciones"
  },
  {
    "value": "otras_dependencias_estatales",
    "label": "Otras dependencias estatales"
  },
  {
    "value": "presidencia",
    "label": "Presidencia"
  },
  {
    "value": "guadalajara",
    "label": "Guadalajara"
  },
  {
    "value": "inspección_y_vigilancia",
    "label": "Inspección y vigilancia"
  },
  {
    "value": "pcyb",
    "label": "PCyB"
  },
  {
    "value": "cercanía_ciudadana",
    "label": "Cercanía ciudadana"
  },
  {
    "value": "salud_zapopan",
    "label": "Salud Zapopan"
  },
  {
    "value": "comisaría",
    "label": "Comisaría"
  },
  {
    "value": "comude",
    "label": "COMUDE"
  },
  {
    "value": "caec_(boletos_charros)",
    "label": "CAEC (Boletos Charros)"
  },
  {
    "value": "sindicatura",
    "label": "Sindicatura"
  },
  {
    "value": "administración_e_innovación_gubernamental",
    "label": "Administración e Innovación Gubernamental"
  },
  {
    "value": "amim",
    "label": "AMIM"
  },
  {
    "value": "cursos_en_el_parque_de_las_niñas_y_niños",
    "label": "Cursos en el Parque de las niñas y  niños"
  },
  {
    "value": "romería",
    "label": "Romería"
  },
  {
    "value": "contraloría_ciudadana",
    "label": "Contraloría ciudadana"
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

const social_network: DataCombox[] = [
  { value: "facebook", label: "Facebook" },
  { value: "x", label: "X" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "Tik Tok" }
]

export default function Form({ defaultData }) {
  const { register, handleSubmit, control, reset } = useForm<Inputs>({
    defaultValues: defaultData
  })

  const saveData: SubmitHandler<Inputs> = async (dataForm) => {
    toast.promise(sendDataSupabase(dataForm), {
      loading: "Enviando datos...",
      success: () => {
        reset()
        return "Datos enviados correctamente!"
      },
      error: "Error enviando datos, intente nuevamente",
      position: "top-center"
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Formulario de bitácora</CardTitle>
      </CardHeader>
      <CardContent className="border-0">
        <form onSubmit={handleSubmit(saveData)}>
          <div className='flex flex-col gap-6'>
            <div className="grid gap-3">
              <Label htmlFor='username'>Nombre de usuario</Label>
              <Input {...register("username")} id='username' type='text' name='username' />
            </div>
            <div className='grid grid-cols-2'>
              <div className="grid gap-3">
                <Label htmlFor='account'>Cuenta</Label>
                <Controller
                  name="account"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          cuentas.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='channel'>Canal</Label>
                <Controller
                  name="channel"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          canal.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
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
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          categoria.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='area_responsable'>Área responsable</Label>
                <Controller
                  name="area_responsable"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          area.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
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
            <div className='grid grid-cols-3 gap-3'>
              <div className="grid gap-3">
                <Label htmlFor='social_network'>Red Social</Label>
                <Controller
                  name="social_network"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          social_network.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='priority'>Prioridad</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          prioridad.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor='status'>Estatus</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          estatus.map((option) => (
                            <SelectItem value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
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
