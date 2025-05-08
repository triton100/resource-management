"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Upload, X, Plus } from "lucide-react"

// Mock skills data
const initialSkills = [
  {
    id: 1,
    name: "React",
    level: "Expert",
    years: 4,
    description: "Building complex web applications with React and related ecosystem tools.",
    certifications: [{ id: 1, name: "React Certification.pdf", url: "#" }],
  },
  {
    id: 2,
    name: "TypeScript",
    level: "Advanced",
    years: 3,
    description: "Using TypeScript for type-safe JavaScript development.",
    certifications: [],
  },
  {
    id: 3,
    name: "Node.js",
    level: "Intermediate",
    years: 2,
    description: "Building backend services and APIs with Node.js and Express.",
    certifications: [{ id: 2, name: "Node.js Basics.pdf", url: "#" }],
  },
]

type Skill = {
  id: number
  name: string
  level: string
  years: number
  description: string
  certifications: { id: number; name: string; url: string }[]
}

type SkillFormData = Omit<Skill, "id" | "certifications"> & {
  id?: number
  certifications?: { id: number; name: string; url: string }[]
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    level: "",
    years: 0,
    description: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "years" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      level: value,
    })
  }

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now(),
      ...formData,
      certifications: [],
    }

    setSkills([...skills, newSkill])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Skill added",
      description: `${newSkill.name} has been added to your skills.`,
    })
  }

  const handleEditSkill = () => {
    if (!currentSkill) return

    const updatedSkills = skills.map((skill) => (skill.id === currentSkill.id ? { ...skill, ...formData } : skill))

    setSkills(updatedSkills)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Skill updated",
      description: `${formData.name} has been updated successfully.`,
    })
  }

  const handleDeleteSkill = (id: number) => {
    const skillToDelete = skills.find((skill) => skill.id === id)

    setSkills(skills.filter((skill) => skill.id !== id))

    toast({
      title: "Skill deleted",
      description: `${skillToDelete?.name} has been removed from your skills.`,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadCertification = () => {
    if (!currentSkill || !selectedFile) return

    const newCertification = {
      id: Date.now(),
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
    }

    const updatedSkills = skills.map((skill) =>
      skill.id === currentSkill.id
        ? {
            ...skill,
            certifications: [...skill.certifications, newCertification],
          }
        : skill,
    )

    setSkills(updatedSkills)
    setIsUploadDialogOpen(false)
    setSelectedFile(null)

    toast({
      title: "Certification uploaded",
      description: `${selectedFile.name} has been added to ${currentSkill.name}.`,
    })
  }

  const handleDeleteCertification = (skillId: number, certId: number) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === skillId
        ? {
            ...skill,
            certifications: skill.certifications.filter((cert) => cert.id !== certId),
          }
        : skill,
    )

    setSkills(updatedSkills)

    toast({
      title: "Certification removed",
      description: "The certification has been removed successfully.",
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      level: "",
      years: 0,
      description: "",
    })
    setCurrentSkill(null)
  }

  const openEditDialog = (skill: Skill) => {
    setCurrentSkill(skill)
    setFormData({
      name: skill.name,
      level: skill.level,
      years: skill.years,
      description: skill.description,
    })
    setIsEditDialogOpen(true)
  }

  const openUploadDialog = (skill: Skill) => {
    setCurrentSkill(skill)
    setIsUploadDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Skills</h1>
            <p className="text-muted-foreground">Manage your professional skills and certifications</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogDescription>Add a new skill to your professional profile.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Python, Project Management"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="level">Proficiency Level</Label>
                    <Select value={formData.level} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="years">Years of Experience</Label>
                    <Input
                      id="years"
                      name="years"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.years}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your experience with this skill"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSkill}>Add Skill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Skill Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
              <DialogDescription>Update your skill information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Skill Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-level">Proficiency Level</Label>
                  <Select value={formData.level} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-years">Years of Experience</Label>
                  <Input
                    id="edit-years"
                    name="years"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.years}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSkill}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Certification Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Certification</DialogTitle>
              <DialogDescription>Upload a certification or proof document for {currentSkill?.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="certification">Certification File</Label>
                <Input
                  id="certification"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-muted-foreground">Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <div className="flex-1 truncate">{selectedFile.name}</div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadCertification} disabled={!selectedFile}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Skills List */}
        <div className="grid gap-6">
          {skills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="mb-4 text-center text-muted-foreground">You haven&apos;t added any skills yet.</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            skills.map((skill) => (
              <Card key={skill.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {skill.name}
                        <Badge variant="outline" className="ml-2">
                          {skill.level}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {skill.years} {skill.years === 1 ? "year" : "years"} of experience
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(skill)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSkill(skill.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{skill.description}</p>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-medium">Certifications & Documents</h4>
                        <Button variant="outline" size="sm" onClick={() => openUploadDialog(skill)}>
                          <Upload className="mr-2 h-3 w-3" />
                          Upload
                        </Button>
                      </div>

                      {skill.certifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No certifications uploaded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {skill.certifications.map((cert) => (
                            <div key={cert.id} className="flex items-center justify-between rounded-md border p-2">
                              <div className="flex items-center gap-2">
                                <div className="text-sm">{cert.name}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                      <polyline points="15 3 21 3 21 9"></polyline>
                                      <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                    <span className="sr-only">View</span>
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteCertification(skill.id, cert.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
