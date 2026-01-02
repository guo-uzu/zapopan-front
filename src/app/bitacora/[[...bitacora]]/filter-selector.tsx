import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Field, FieldLabel, } from '@/components/ui/field'
import { PopoverContent } from '@/components/ui/popover'
import { Inputs } from '@/hooks/types'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Control, Controller, Path } from 'react-hook-form'

export default function FilterSelector({ control, column, name, label }: { control: Control<Inputs>, column: { id: string, value: string }[], name: Path<Inputs>, label: string }) {
    const [open, setOpen] = useState(false)

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger>
                            <Button
                                variant="outline"
                                role='combobox'
                                type='button'
                                aria-expanded={open}
                                className='w-full'
                            >
                                <span className='truncate'>
                                    {
                                        field.value
                                            ? column.find((data) => data.id === field.value)?.value
                                            : "Selecciona una opción..."
                                    }
                                </span>
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Busca alguna opción..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No se encontró esa opción.</CommandEmpty>
                                    <CommandGroup>
                                        {
                                            column.map((data) => (
                                                <CommandItem
                                                    key={data.id}
                                                    value={data.id}
                                                    onSelect={() => {
                                                        field.onChange(data.id === field.value ? "" : data.id)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {data.value}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            field.value === data.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
            />
        </Field>
    )
}
