
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Clock, Search, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  grade: string;
  present: boolean;
  hasPreOrdered: boolean;
  mealType: string | null;
}

const TeacherPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock student data
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alex Johnson', grade: '11th Grade', present: true, hasPreOrdered: true, mealType: 'Full Meal' },
    { id: '2', name: 'Maria Garcia', grade: '11th Grade', present: true, hasPreOrdered: true, mealType: 'Vegetarian' },
    { id: '3', name: 'James Wilson', grade: '11th Grade', present: false, hasPreOrdered: true, mealType: 'Full Meal' },
    { id: '4', name: 'Sophia Lee', grade: '11th Grade', present: true, hasPreOrdered: false, mealType: null },
    { id: '5', name: 'Ethan Brown', grade: '11th Grade', present: true, hasPreOrdered: true, mealType: 'Full Meal' },
    { id: '6', name: 'Olivia Martinez', grade: '11th Grade', present: true, hasPreOrdered: false, mealType: null },
    { id: '7', name: 'Noah Davis', grade: '11th Grade', present: false, hasPreOrdered: false, mealType: null },
    { id: '8', name: 'Emma Taylor', grade: '11th Grade', present: true, hasPreOrdered: true, mealType: 'Gluten Free' },
    { id: '9', name: 'William Clark', grade: '11th Grade', present: true, hasPreOrdered: true, mealType: 'Full Meal' },
    { id: '10', name: 'Ava Rodriguez', grade: '11th Grade', present: true, hasPreOrdered: true, mealType: 'Vegetarian' },
    { id: '11', name: 'Benjamin White', grade: '11th Grade', present: false, hasPreOrdered: true, mealType: 'Full Meal' },
    { id: '12', name: 'Charlotte Hill', grade: '11th Grade', present: true, hasPreOrdered: false, mealType: null }
  ]);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleAttendance = (id: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id 
          ? { ...student, present: !student.present } 
          : student
      )
    );
    
    const student = students.find(s => s.id === id);
    if (student) {
      toast.success(`${student.name} marked as ${!student.present ? 'present' : 'absent'}`);
    }
  };
  
  const presentCount = students.filter(s => s.present).length;
  const preOrderedCount = students.filter(s => s.hasPreOrdered).length;
  const presentWithPreOrderCount = students.filter(s => s.present && s.hasPreOrdered).length;
  
  const markAllPresent = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, present: true }))
    );
    toast.success("All students marked as present");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Teacher Portal</h1>
              <p className="text-gray-500">Manage attendance and view pre-orders</p>
            </div>
            
            <div>
              <Button className="flex items-center gap-2 bg-cafeteria-secondary hover:bg-cafeteria-secondary/90">
                <Clock size={16} />
                <span>Today's Schedule</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Students</p>
                  <h3 className="text-2xl font-bold">{students.length}</h3>
                </div>
                <div className="p-3 bg-cafeteria-primary/10 text-cafeteria-primary rounded-full">
                  <Users size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Present Today</p>
                  <h3 className="text-2xl font-bold">{presentCount}</h3>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <Check size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pre-Ordered</p>
                  <h3 className="text-2xl font-bold">{preOrderedCount}</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Clock size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Present with Orders</p>
                  <h3 className="text-2xl font-bold">{presentWithPreOrderCount}</h3>
                </div>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                  <Users size={24} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Student List</CardTitle>
                <Button size="sm" variant="outline" onClick={markAllPresent}>Mark All Present</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Search students..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Present</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Grade</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Pre-Ordered</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Meal Type</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStudents.map(student => (
                      <tr key={student.id} className={`hover:bg-gray-50 ${!student.present ? 'bg-gray-50 text-gray-400' : ''}`}>
                        <td className="py-3 px-4">
                          <Checkbox 
                            checked={student.present}
                            onCheckedChange={() => handleToggleAttendance(student.id)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4">{student.grade}</td>
                        <td className="py-3 px-4">
                          {student.hasPreOrdered ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {student.mealType || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button size="sm" variant="ghost">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherPortal;
