import React, { useState } from 'react'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
  DialogTrigger,
  DialogFooter,
} from './dialog'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

export function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'success' | 'warning' | 'error' | 'info'>('default')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Revamped Dialog Component</h1>
        <p className="text-muted-foreground">Modern, accessible, and feature-rich dialogs</p>
      </div>

      {/* Basic Dialog */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Basic Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Basic Dialog</DialogTitle>
              <DialogDescription>
                This is a basic dialog with default styling and behavior.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p>This dialog demonstrates the basic functionality with improved styling and animations.</p>
            </DialogBody>
            <DialogActions>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>

      {/* Variant Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Default</Button>
            </DialogTrigger>
            <DialogContent variant="default">
              <DialogHeader>
                <DialogTitle variant="default">Default Dialog</DialogTitle>
                <DialogDescription>
                  Standard dialog with neutral styling.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>This is the default variant with clean, professional styling.</p>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-200 text-green-700">Success</Button>
            </DialogTrigger>
            <DialogContent variant="success">
              <DialogHeader>
                <DialogTitle variant="success">Success!</DialogTitle>
                <DialogDescription>
                  Your action was completed successfully.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>This variant is perfect for confirmation messages and successful operations.</p>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-yellow-200 text-yellow-700">Warning</Button>
            </DialogTrigger>
            <DialogContent variant="warning">
              <DialogHeader>
                <DialogTitle variant="warning">Warning</DialogTitle>
                <DialogDescription>
                  Please review your action before proceeding.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>Use this variant for important notices that require user attention.</p>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-700">Error</Button>
            </DialogTrigger>
            <DialogContent variant="error">
              <DialogHeader>
                <DialogTitle variant="error">Error</DialogTitle>
                <DialogDescription>
                  Something went wrong. Please try again.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>This variant is ideal for error messages and critical alerts.</p>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 text-blue-700">Info</Button>
            </DialogTrigger>
            <DialogContent variant="info">
              <DialogHeader>
                <DialogTitle variant="info">Information</DialogTitle>
                <DialogDescription>
                  Here's some helpful information for you.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p>Use this variant for informational content and helpful tips.</p>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Size Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog Sizes</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Small</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Small Dialog</DialogTitle>
                <DialogDescription>Compact dialog for simple messages.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Medium</Button>
            </DialogTrigger>
            <DialogContent size="md">
              <DialogHeader>
                <DialogTitle>Medium Dialog</DialogTitle>
                <DialogDescription>Standard size for most use cases.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Large</Button>
            </DialogTrigger>
            <DialogContent size="lg">
              <DialogHeader>
                <DialogTitle>Large Dialog</DialogTitle>
                <DialogDescription>Perfect for forms and complex content.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                </div>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Extra Large</Button>
            </DialogTrigger>
            <DialogContent size="xl">
              <DialogHeader>
                <DialogTitle>Extra Large Dialog</DialogTitle>
                <DialogDescription>Great for complex forms and detailed content.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" />
                  </div>
                  <div>
                    <Label htmlFor="email-xl">Email</Label>
                    <Input id="email-xl" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={4} />
                  </div>
                </div>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Full Screen</Button>
            </DialogTrigger>
            <DialogContent size="full">
              <DialogHeader>
                <DialogTitle>Full Screen Dialog</DialogTitle>
                <DialogDescription>Maximum space for complex interfaces.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="h-96 overflow-y-auto">
                  <p className="mb-4">This dialog takes up most of the screen space, perfect for complex forms, data tables, or detailed content.</p>
                  <div className="space-y-4">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">Section {i + 1}</h3>
                        <p>This is content for section {i + 1}. It demonstrates how the full-screen dialog can accommodate large amounts of content.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Form Dialog */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Form Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Item</Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new item.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter title" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description" rows={4} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Enter tags separated by commas" />
                </div>
              </div>
            </DialogBody>
            <DialogActions>
              <Button variant="outline">Cancel</Button>
              <Button>Create Item</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>

      {/* Interactive Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Interactive Demo</h2>
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Variant</Label>
              <Select value={selectedVariant} onValueChange={(value: any) => setSelectedVariant(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <Select value={selectedSize} onValueChange={(value: any) => setSelectedSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="full">Full Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => setIsOpen(true)}>Open Custom Dialog</Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent variant={selectedVariant} size={selectedSize}>
            <DialogHeader>
              <DialogTitle variant={selectedVariant}>
                Custom {selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1)} Dialog
              </DialogTitle>
              <DialogDescription>
                This is a {selectedSize} dialog with {selectedVariant} styling.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p>You can customize the variant and size of dialogs to match your specific use case and design requirements.</p>
            </DialogBody>
            <DialogActions>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
