import json
import random

courses_data = [
    {
        "title": "Python Programming", "category": "Programming",
        "lessons": [
            {"title": "Introduction to Python", "video": "rfscVS0vtbw"},
            {"title": "Python Variables and Data Types", "video": "_uQrJ0TkZlc"},
            {"title": "Python Functions", "video": "kqtD5dpn9C8"}
        ]
    }, {
        "title": "Java Programming", "category": "Programming",
        "lessons": [
            {"title": "Java Basics and Setup", "video": "grEKMHGYyns"},
            {"title": "Object-Oriented Programming in Java", "video": "eIrMbAQSU34"},
            {"title": "Java Collections Framework", "video": "xk4_1vDrzzo"}
        ]
    }, {
        "title": "C Programming", "category": "Programming",
        "lessons": [
            {"title": "Introduction to C", "video": "KJgsSFOSQv0"},
            {"title": "Pointers and Memory Management", "video": "8PopR3x-VMY"}
        ]
    }, {
        "title": "C++ Programming", "category": "Programming",
        "lessons": [
            {"title": "Getting Started with C++", "video": "vLnPwxZdW4Y"},
            {"title": "Classes and Objects in C++", "video": "18c3MTX0PK0"},
            {"title": "C++ STL Tutorial", "video": "8jPQjjsBbIc"}
        ]
    }, {
        "title": "JavaScript", "category": "Web Development",
        "lessons": [
            {"title": "JavaScript Fundamentals", "video": "jS4aFq5-91M"},
            {"title": "DOM Manipulation", "video": "W6NZfCO5SIk"},
            {"title": "Asynchronous JavaScript", "video": "PkZNo7MFOUg"}
        ]
    }, {
        "title": "Web Development", "category": "Web Development",
        "lessons": [
            {"title": "HTML Basics", "video": "G3e-cpL7ofc"},
            {"title": "CSS Layout and Styling", "video": "yfoY53QXEnI"},
            {"title": "JavaScript Fundamentals", "video": "mU6anWqZJcc"}
        ]
    }, {
        "title": "HTML and CSS", "category": "Web Development",
        "lessons": [
            {"title": "HTML5 Semantic Elements", "video": "kUMe1FH4CGY"},
            {"title": "CSS Flexbox and Grid", "video": "1Rs2ND1ryYc"}
        ]
    }, {
        "title": "React Development", "category": "Web Development",
        "lessons": [
            {"title": "React Crash Course for Beginners", "video": "bMknfKXIFA8"},
            {"title": "React Hooks Explained", "video": "SqcY0GlETPk"}
        ]
    }, {
        "title": "Node.js", "category": "Web Development",
        "lessons": [
            {"title": "Node.js Basics Explained", "video": "Oe421EPjeBE"},
            {"title": "Building a REST API with Express", "video": "TlB_eWDSMt4"}
        ]
    }, {
        "title": "Data Structures and Algorithms", "category": "Computer Science",
        "lessons": [
            {"title": "Big O Notation Explained", "video": "8hly31xKli0"},
            {"title": "Arrays and Linked Lists", "video": "RBSGKlAvoiM"},
            {"title": "Binary Search Trees", "video": "t2CEgPsws3U"}
        ]
    }, {
        "title": "Machine Learning", "category": "Data Science",
        "lessons": [
            {"title": "Introduction to Machine Learning", "video": "i_LwzRmA_08"},
            {"title": "Supervised vs Unsupervised Learning", "video": "7eh4d6sabA0"},
            {"title": "Building a Simple ML Model", "video": "GwIoAwogpWU"}
        ]
    }, {
        "title": "Artificial Intelligence", "category": "Data Science",
        "lessons": [
            {"title": "What is Artificial Intelligence?", "video": "JMUxmLqcMak"},
            {"title": "Neural Networks Explained", "video": "aircAruvnKk"}
        ]
    }, {
        "title": "Cybersecurity", "category": "IT & Software",
        "lessons": [
            {"title": "Cybersecurity Basics", "video": "inWWhwg4PTw"},
            {"title": "Network Security Fundamentals", "video": "U_P23SqJaDc"},
            {"title": "Ethical Hacking Intro", "video": "fNzpcB7iRxo"}
        ]
    }, {
        "title": "Cloud Computing", "category": "IT & Software",
        "lessons": [
            {"title": "What is Cloud Computing?", "video": "3hLmDS179YE"},
            {"title": "IaaS, PaaS, SaaS Explained", "video": "M988_fsOSWo"}
        ]
    }, {
        "title": "DevOps", "category": "IT & Software",
        "lessons": [
            {"title": "Introduction to DevOps", "video": "hQcFE0RD0cQ"},
            {"title": "CI/CD Pipeline Explanation", "video": "j5Zsa_eOXeY"}
        ]
    }, {
        "title": "SQL and Databases", "category": "Data Science",
        "lessons": [
            {"title": "Database Management Systems", "video": "HXV3zeQKqGY"},
            {"title": "Writing Complex SQL Queries", "video": "7S_tz1z_5bA"}
        ]
    }, {
        "title": "Git and GitHub", "category": "Development Tools",
        "lessons": [
            {"title": "Git Workflow Tutorial", "video": "RGOj5yH7evk"},
            {"title": "Collaborating on GitHub", "video": "8JJ101D3knE"}
        ]
    }, {
        "title": "Linux", "category": "IT & Software",
        "lessons": [
            {"title": "Linux Operating System basics", "video": "sWbUDq4S6Y8"},
            {"title": "Linux Command Line Commands", "video": "v_1iqtOnXDM"},
            {"title": "Linux File System Explained", "video": "HbgzrKJvDRw"}
        ]
    }, {
        "title": "Operating Systems", "category": "Computer Science",
        "lessons": [
            {"title": "How Operating Systems Work", "video": "vBURTt97EkA"},
            {"title": "Process Management", "video": "Ro2DtaA2_kE"}
        ]
    }, {
        "title": "Computer Networks", "category": "Computer Science",
        "lessons": [
            {"title": "Networking Basics", "video": "qiQR5rTSshw"},
            {"title": "TCP/IP Model vs OSI Model", "video": "IPvYjXCsTg8"}
        ]
    }, {
        "title": "Mobile App Development", "category": "Mobile Development",
        "lessons": [
            {"title": "Native vs Cross-Platform Apps", "video": "0-S5a0eXPoc"},
            {"title": "Intro to Mobile Development", "video": "VPvVD8t02U8"}
        ]
    }, {
        "title": "Android Development", "category": "Mobile Development",
        "lessons": [
            {"title": "Android Studio Setup", "video": "fis26HvvDII"},
            {"title": "Building Your First Android App", "video": "EOfCEhWq8sg"}
        ]
    }, {
        "title": "iOS Development", "category": "Mobile Development",
        "lessons": [
            {"title": "Swift Programming Basics", "video": "comQ1-x2a1Q"},
            {"title": "Building an iOS App using SwiftUI", "video": "8Xg7E9shq0U"}
        ]
    }, {
        "title": "Software Engineering", "category": "Computer Science",
        "lessons": [
            {"title": "Software Development Life Cycle", "video": "OqjLExqLAlA"},
            {"title": "Agile Methodology", "video": "bKbRVzCUUZ4"}
        ]
    }, {
        "title": "System Design", "category": "Computer Science",
        "lessons": [
            {"title": "System Design Basics", "video": "bUHFg8CZFws"},
            {"title": "Scaling Distributed Applications", "video": "m8Icp_Cid5o"}
        ]
    }, {
        "title": "Digital Marketing", "category": "Marketing",
        "lessons": [
            {"title": "Intro to Digital Marketing", "video": "bixR-KIJKYM"},
            {"title": "Search Engine Optimization (SEO)", "video": "x84HGEW70g4"}
        ]
    }, {
        "title": "Business Management", "category": "Business",
        "lessons": [
            {"title": "Principles of Management", "video": "zeM-DIB9M3U"},
            {"title": "Developing Leadership Skills", "video": "v2oJ1iXoQ-o"}
        ]
    }, {
        "title": "Entrepreneurship", "category": "Business",
        "lessons": [
            {"title": "How to Start a Startup", "video": "W3bXyvE_PXY"},
            {"title": "Writing a Winning Business Plan", "video": "L_S0GkYh8cE"}
        ]
    }, {
        "title": "Finance Basics", "category": "Finance",
        "lessons": [
            {"title": "Personal Finance 101", "video": "ZcIINw9vFjU"},
            {"title": "Understanding Financial Statements", "video": "T1r1uA1Uun8"}
        ]
    }, {
        "title": "Stock Market Basics", "category": "Finance",
        "lessons": [
            {"title": "How the Stock Market Works", "video": "p7HKvqRI_Bo"},
            {"title": "Value Investing for Beginners", "video": "hqyT6RIfpD4"}
        ]
    }, {
        "title": "Graphic Design", "category": "Design",
        "lessons": [
            {"title": "Graphic Design Principles", "video": "YwFOA4CIs1U"},
            {"title": "Typography and Color Theory", "video": "c9Wg6Cb_YlU"}
        ]
    }, {
        "title": "UI/UX Design", "category": "Design",
        "lessons": [
            {"title": "What is UI and UX Research?", "video": "O_uBq9jM7J0"},
            {"title": "Figma Tutorial for Beginners", "video": "Zz_un26P53k"}
        ]
    }, {
        "title": "Project Management", "category": "Business",
        "lessons": [
            {"title": "Project Management Fundamentals", "video": "B350aE5EPEw"},
            {"title": "Scrum Framework Explained", "video": "qKv-EunqFE8"}
        ]
    }, {
        "title": "Communication Skills", "category": "Personal Development",
        "lessons": [
            {"title": "Effective Workplace Communication", "video": "HAnw168huqA"},
            {"title": "Public Speaking Tips", "video": "XR14WGvcb8I"}
        ]
    }, {
        "title": "Productivity & Time Management", "category": "Personal Development",
        "lessons": [
            {"title": "Time Management Techniques", "video": "8aR7nIQE0nE"},
            {"title": "Overcoming Procrastination", "video": "tPYj3fFJGjk"}
        ]
    }, {
        "title": "Angular Framework", "category": "Web Development",
        "lessons": [
            {"title": "Angular Setup and Architecture", "video": "k5E2AVpwsko"},
            {"title": "Angular Components and Services", "video": "3qBXWUpoPHo"}
        ]
    }, {
        "title": "Vue.js Framework", "category": "Web Development",
        "lessons": [
            {"title": "Getting Started with Vue 3", "video": "FXpIoQ_rT_c"},
            {"title": "Vue Composition API Explained", "video": "3B0ry4GI1cE"}
        ]
    }, {
        "title": "Next.js", "category": "Web Development",
        "lessons": [
            {"title": "Next.js App Router Setup", "video": "ZVnjOPwW4ZA"},
            {"title": "Server-Side Rendering (SSR)", "video": "vwSlcGcsZyo"}
        ]
    }, {
        "title": "TypeScript", "category": "Web Development",
        "lessons": [
            {"title": "TypeScript Basics", "video": "BwuLxPH8IDs"},
            {"title": "Advanced TypeScript Types", "video": "d56mG7DezGs"}
        ]
    }, {
        "title": "Docker", "category": "IT & Software",
        "lessons": [
            {"title": "Docker Concepts & Architecture", "video": "3c-iBn73dDE"},
            {"title": "Docker Compose Configuration", "video": "pTFZFxd4hOI"}
        ]
    }, {
        "title": "Kubernetes", "category": "IT & Software",
        "lessons": [
            {"title": "Kubernetes Architecture Overview", "video": "X48VuDVv0do"},
            {"title": "Deploying Microservices on K8s", "video": "d6WC5n9G_sM"}
        ]
    }, {
        "title": "AWS", "category": "IT & Software",
        "lessons": [
            {"title": "AWS Certified Cloud Practitioner", "video": "k1EYcfuCEo4"},
            {"title": "Setting up EC2 and S3", "video": "Ia-UEYYRCEI"}
        ]
    }, {
        "title": "Azure", "category": "IT & Software",
        "lessons": [
            {"title": "Azure Fundamentals (AZ-900)", "video": "NKEFWyqJbTA"},
            {"title": "Deploying Apps on Microsoft Azure", "video": "tDqAFeVvEIM"}
        ]
    }, {
        "title": "GCP", "category": "IT & Software",
        "lessons": [
            {"title": "Google Cloud Platform Tutorial", "video": "vQgWE_Jw1Eg"},
            {"title": "GCP Core Infrastructure", "video": "lZAoFs75_cs"}
        ]
    }, {
        "title": "Django", "category": "Web Development",
        "lessons": [
            {"title": "Django Models and Views", "video": "F5mRW0jo-U4"},
            {"title": "Building a Django Application step-by-step", "video": "rHux0gMZ3Eg"}
        ]
    }, {
        "title": "Flask", "category": "Web Development",
        "lessons": [
            {"title": "Flask Tutorial for Beginners", "video": "Z1RJmh_OqeA"},
            {"title": "REST APIs with Flask", "video": "GMppyAPbLYk"}
        ]
    }, {
        "title": "Spring Boot", "category": "Programming",
        "lessons": [
            {"title": "Spring Boot Quick Start", "video": "9SGDpanrc8U"},
            {"title": "Building Microservices with Spring Boot", "video": "vtPkZqGNvJE"}
        ]
    }, {
        "title": "Data Science", "category": "Data Science",
        "lessons": [
            {"title": "Data Science Fundamentals", "video": "ua-CiDNNj30"},
            {"title": "Pandas for Data Analysis", "video": "vmEHCJofslg"}
        ]
    }, {
        "title": "Data Analytics", "category": "Data Science",
        "lessons": [
            {"title": "Introduction to Data Analytics", "video": "AYJ9sJ22z_E"},
            {"title": "Tableau Dashboards Tutorial", "video": "aHaOBIcwkuE"}
        ]
    }, {
        "title": "Blockchain", "category": "IT & Software",
        "lessons": [
            {"title": "Blockchain Technology Explained", "video": "qOVAbKKSH10"},
            {"title": "Writing Ethereum Smart Contracts", "video": "ZE2HxTmxzpk"}
        ]
    }
]

authors = [
    'Dr. Angela Smith', 'John Doe', 'Sarah Johnson', 'Michael Chang',
    'Alex Murphy', 'Emily Chen', 'David Miller', 'Chris Evans',
    'Jessica Alba', 'Robert Downey', 'Kishora Y E'
]

thumbnails = [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
]

courses = []
c_id = 1

for bp in courses_data:
    lessons_list = []
    
    # Process the custom mapped lessons
    for i, lesson_data in enumerate(bp["lessons"]):
        # Keep durations somewhat realistic per topic
        duration = f"{random.randint(5, 25):02d}:{random.choice(['00', '15', '30', '45'])}"
        lessons_list.append({
            "id": c_id * 1000 + (i + 1),
            "title": lesson_data["title"],
            "videoUrl": f"https://www.youtube.com/watch?v={lesson_data['video']}",
            "duration": duration,
            "completed": False,
            "order": i + 1
        })
        
    course = {
        "id": c_id,
        "title": bp["title"],
        "category": bp["category"],
        "author": random.choice(authors),
        "price": random.choice([199, 249, 299, 349, 399, 449, 499]),
        "rating": round(random.uniform(4.0, 5.0), 1),
        "students": random.randint(1000, 50000),
        "thumbnail": random.choice(thumbnails),
        "progress": random.choice([0, 0, 0, 10, 25, 50, 75, 100]),
        "description": f"Comprehensive course on {bp['title']}. Learn the latest techniques and master the skills required to excel in {bp['category']}.",
        "lessons": lessons_list
    }
    
    courses.append(course)
    c_id += 1

js_code = f"export const courses = {json.dumps(courses, indent=2)};\n"
with open("d:\\A\\LMS\\src\\data\\mockData.js", "w") as f:
    f.write(js_code)
