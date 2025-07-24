export const defaultTestsData = {
  exams: [
    {
      id: '10th-standard',
      name: '10th Standard',
      description: 'Secondary School Certificate Examination',
      subjects: [
        {
          id: 'mathematics-10',
          name: 'Mathematics',
          chapters: [
            {
              id: 'algebra-10',
              name: 'Algebra',
              questions: [
                {
                  id: 'alg-q1',
                  question: 'Solve for x: 2x + 5 = 15',
                  options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 2.5'],
                  correctAnswer: 0,
                  difficulty: 'Easy',
                  explanation: '2x = 15 - 5 = 10, therefore x = 5'
                },
                {
                  id: 'alg-q2',
                  question: 'What is the value of x² - 4x + 4 when x = 3?',
                  options: ['1', '4', '9', '16'],
                  correctAnswer: 0,
                  difficulty: 'Medium',
                  explanation: '3² - 4(3) + 4 = 9 - 12 + 4 = 1'
                }
              ]
            },
            {
              id: 'geometry-10',
              name: 'Geometry',
              questions: [
                {
                  id: 'geo-q1',
                  question: 'The sum of interior angles of a triangle is:',
                  options: ['90°', '180°', '270°', '360°'],
                  correctAnswer: 1,
                  difficulty: 'Easy',
                  explanation: 'The sum of interior angles of any triangle is always 180°'
                }
              ]
            }
          ]
        },
        {
          id: 'science-10',
          name: 'Science',
          chapters: [
            {
              id: 'physics-10',
              name: 'Physics',
              questions: [
                {
                  id: 'phy-q1',
                  question: 'What is the unit of force?',
                  options: ['Joule', 'Newton', 'Watt', 'Pascal'],
                  correctAnswer: 1,
                  difficulty: 'Easy',
                  explanation: 'Force is measured in Newtons (N) in the SI system'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '12th-standard',
      name: '12th Standard',
      description: 'Higher Secondary Certificate Examination',
      subjects: [
        {
          id: 'physics-12',
          name: 'Physics',
          chapters: [
            {
              id: 'mechanics-12',
              name: 'Mechanics',
              questions: [
                {
                  id: 'mech-q1',
                  question: 'What is Newton\'s second law of motion?',
                  options: ['F = ma', 'F = mv', 'F = m/a', 'F = a/m'],
                  correctAnswer: 0,
                  difficulty: 'Medium',
                  explanation: 'Newton\'s second law states that Force equals mass times acceleration'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'jee',
      name: 'JEE',
      description: 'Joint Entrance Examination',
      subjects: [
        {
          id: 'mathematics-jee',
          name: 'Mathematics',
          chapters: [
            {
              id: 'calculus-jee',
              name: 'Calculus',
              questions: [
                {
                  id: 'calc-q1',
                  question: 'What is the derivative of x²?',
                  options: ['x', '2x', 'x³', '2x²'],
                  correctAnswer: 1,
                  difficulty: 'Medium',
                  explanation: 'Using power rule: d/dx(x²) = 2x'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'neet',
      name: 'NEET',
      description: 'National Eligibility cum Entrance Test',
      subjects: [
        {
          id: 'biology-neet',
          name: 'Biology',
          chapters: [
            {
              id: 'cell-biology',
              name: 'Cell Biology',
              questions: [
                {
                  id: 'cell-q1',
                  question: 'What is the powerhouse of the cell?',
                  options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
                  correctAnswer: 1,
                  difficulty: 'Easy',
                  explanation: 'Mitochondria produces ATP, the energy currency of cells'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'gate',
      name: 'GATE',
      description: 'Graduate Aptitude Test in Engineering',
      subjects: [
        {
          id: 'computer-science',
          name: 'Computer Science',
          chapters: [
            {
              id: 'data-structures',
              name: 'Data Structures',
              questions: [
                {
                  id: 'ds-q1',
                  question: 'What is the time complexity of binary search?',
                  options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
                  correctAnswer: 1,
                  difficulty: 'Medium',
                  explanation: 'Binary search divides the search space in half each time'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'upsc',
      name: 'UPSC',
      description: 'Union Public Service Commission',
      subjects: [
        {
          id: 'general-studies',
          name: 'General Studies',
          chapters: [
            {
              id: 'indian-history',
              name: 'Indian History',
              questions: [
                {
                  id: 'hist-q1',
                  question: 'Who was the first Prime Minister of India?',
                  options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Subhas Chandra Bose'],
                  correctAnswer: 1,
                  difficulty: 'Easy',
                  explanation: 'Jawaharlal Nehru was India\'s first Prime Minister from 1947 to 1964'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'gpsc',
      name: 'GPSC',
      description: 'Gujarat Public Service Commission',
      subjects: [
        {
          id: 'gujarat-gk',
          name: 'Gujarat General Knowledge',
          chapters: [
            {
              id: 'gujarat-geography',
              name: 'Gujarat Geography',
              questions: [
                {
                  id: 'guj-q1',
                  question: 'What is the capital of Gujarat?',
                  options: ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara'],
                  correctAnswer: 1,
                  difficulty: 'Easy',
                  explanation: 'Gandhinagar is the capital city of Gujarat state'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'other-exams',
      name: 'Other Exams',
      description: 'Miscellaneous Competitive Examinations',
      subjects: [
        {
          id: 'general-aptitude',
          name: 'General Aptitude',
          chapters: [
            {
              id: 'logical-reasoning',
              name: 'Logical Reasoning',
              questions: [
                {
                  id: 'lr-q1',
                  question: 'If A = 1, B = 2, C = 3... what is the value of CAB?',
                  options: ['312', '321', '123', '213'],
                  correctAnswer: 0,
                  difficulty: 'Easy',
                  explanation: 'C=3, A=1, B=2, so CAB = 312'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};