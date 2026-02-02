/**
 * Technical Keywords Whitelist
 * 
 * This list defines the only tags that will be displayed in the "SKILLS" section.
 * Any project tags not in this list (e.g., company names, project names) will be filtered out.
 * 
 * Add new technical skills, languages, frameworks, and tools here.
 * The filtering is case-insensitive.
 */

export const technicalKeywords = [
    // --- PROGRAMMING LANGUAGES ---
    "Python", "TypeScript", "JavaScript", "C++", "C", "C#", "Rust", "Go", "Java", "Kotlin", "Swift",
    "PHP", "Ruby", "Lua", "R", "Julia", "Haskell", "Scala", "Zig", "Elixir", "Erlang", "F#",
    "OCaml", "Dart", "Perl", "Groovy", "Clojure", "Lisp", "Fortran", "COBOL", "Ada", "Pascal",
    "Assembly", "x86 Assembly", "ARM Assembly", "MIPS", "RISC-V", "WebAssembly", "Wasm",
    "Verilog", "SystemVerilog", "VHDL", "Solidity", "Vyper", "Move", "SQL", "NoSQL",
    "Shell", "Bash", "Zsh", "PowerShell", "Fish", "Makefile", "CMake", "Gnuplot", "MATLAB", "Simulink",
    "LabVIEW", "Processing", "Sass", "SCSS", "Less", "Stylus", "GraphQL", "Protobuf", "Thrift",
    "JSON", "YAML", "TOML", "XML", "Markdown", "LaTeX", "HTML", "HTML5", "CSS", "CSS3",

    // --- AI, ML & DATA SCIENCE ---
    // Deep Learning Frameworks
    "PyTorch", "TensorFlow", "Keras", "JAX", "Flax", "MXNet", "Chainer", "PaddlePaddle", "TFLite", "TensorRT",
    "ONNX", "ONNX Runtime", "CoreML", "OpenVINO", "DeepSpeed", "Megatron-LM", "Horovod", "PyTorch Lightning",
    "Fastai", "Keras Core",

    // ML Libraries & Tools
    "Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Statsmodels", "SciPy", "NumPy", "Pandas", "Polars",
    "Dask", "Vaex", "Modin", "Ray", "Rapids", "CuPy", "Numba", "Cython", "SymPy",

    // LLMs & NLP
    "LLM", "Transformers", "Hugging Face", "LangChain", "LlamaIndex", "GPT", "BERT", "RoBERTa", "T5",
    "Llama", "Mistral", "Falcon", "Whisper", "Stable Diffusion", "Midjourney", "DALL-E", "LoRA", "QLoRA",
    "RAG", "Vector Databases", "Embeddings", "Tokenizers", "NLTK", "Spacy", "Gensim", "TextBlob", "Flair",
    "AllenNLP", "CoreNLP", "OpenAI API", "Anthropic API", "Cohere API", "Ollama", "LocalAI", "vLLM", "TGI",
    "CTransformers", "GGML", "GGUF", "DeepSeek", "Claude", "Gemini",

    // Computer Vision
    "Computer Vision", "OpenCV", "Pillow", "Scikit-image", "YOLO", "Ultralytics", "Detectron2", "MediaPipe",
    "MMDetection", "MMPose", "DeepLab", "Mask R-CNN", "Faster R-CNN", "SSD", "ResNet", "EfficientNet",
    "ViT", "Vision Transformers", "SAM", "Segment Anything", "Stable Video Diffusion", "Albumentations",
    "Timm", "Kornia", "OpenGL", "WebGL", "Vulkan", "Three.js", "D3.js", "Fabric.js", "Canvas API",

    // MLOps & Data Engineering
    "MLOps", "MLflow", "Kubeflow", "TFX", "Weights & Biases", "Comet ML", "Neptune.ai", "DVC", "Pachyderm",
    "LakeFS", "Delta Lake", "Iceberg", "Hudi", "Databricks", "Snowflake", "BigQuery", "Redshift", "Athena",
    "Spark", "Apache Spark", "Hadoop", "Kafka", "Apache Kafka", "Flink", "Beam", "Airflow", "Dagster",
    "Prefect", "Luigi", "Mage", "dbt", "Great Expectations", "Pandera",
    "Vector DBs", "Pinecone", "Milvus", "Weaviate", "Qdrant", "Chroma", "ChromaDB", "Faiss", "LanceDB", "Elasticsearch",

    // --- ROBOTICS & EMBEDDED SYSTEMS ---
    // Robotics
    "ROS", "ROS1", "ROS2", "ROS2 Humble", "ROS2 Foxy", "ROS2 Iron", "ROS2 Jazzy", "MoveIt", "MoveIt2",
    "Nav2", "Gazebo", "Ignition Gazebo", "Webots", "CoppeliaSim", "V-REP", "Isaac Sim", "Isaac Gym",
    "MuJoCo", "PyBullet", "Drake", "Dart Physics", "Rviz", "Foxglove", "URDF", "SDF", "Xacro",
    "Lidar", "SLAM", "GMapping", "AMCL", "Cartographer", "ORB-SLAM", "Visual SLAM", "VIO",
    "Path Planning", "Motion Planning", "OMPL", "Control Theory", "PID", "MPC", "LQR", "Kalman Filter",
    "EKF", "UKF", "Particle Filter", "Localization", "Mapping", "Odometry", "Sensor Fusion",
    "Point Cloud", "PCL", "Open3D", "Robotics Middleware", "DDS", "FastDDS", "CycloneDDS",

    // Embedded & Hardware
    "Embedded Systems", "RTOS", "FreeRTOS", "Zephyr", "Mbed OS", "Yocto", "Buildroot", "PlatformIO",
    "Arduino", "Raspberry Pi", "ESP32", "ESP8266", "STM32", "Nordic nRF", "AVR", "PIC", "MSP430",
    "ARM Cortex", "RISC-V", "Microchip", "NXP", "Texas Instruments", "Jetson", "Jetson Nano", "Jetson Orin",
    "Edge AI", "TinyML", "MicroPython", "CircuitPython", "Firmware", "Driver Development", "Bare Metal",
    "I2C", "SPI", "UART", "CAN", "CAN Bus", "Modbus", "MQTT", "LoRa", "LoRaWAN", "Zigbee", "BLE",
    "Bluetooth", "WiFi", "NFC", "RFID", "GPS", "GNSS", "IMU", "Sensors", "Actuators", "Motors",
    "Stepper Motors", "BLDC", "Servo", "PWM", "ADC", "DAC", "GPIO", "JTAG", "SWD", "Logic Analyzer",

    // Electronics Design
    "PCB Design", "Altium Designer", "KiCad", "Eagle", "OrCAD", "EasyEDA", "Fritzing", "Proteus",
    "Spice", "LTspice", "Multisim", "Verilog", "VHDL", "FPGA", "Xilinx", "Vivado", "Altera", "Quartus",
    "ASIC", "VLSI", "RTL Design", "Signal Integrity", "Power Integrity", "Schematic Capture", "Gerber",

    // --- BACKEND & CLOUD ---
    // Frameworks
    "Node.js", "Express", "NestJS", "Fastify", "Koa", "Hono", "Elysia", "AdonisJS",
    "Django", "Flask", "FastAPI", "Litestar", "Tornado", "Sanic", "Pyramid",
    "Spring", "Spring Boot", "Hibernate", "Jakarta EE", "Micronaut", "Quarkus", "Vert.x",
    "ASP.NET", "ASP.NET Core", "Entity Framework", "Blazor",
    "Go Gin", "Echo", "Fiber", "Chi", "Gorm", "Ent",
    "Rust Axum", "Actix", "Actix Web", "Rocket", "Tower", "Tokio", "Diesel", "Sqlx",
    "Ruby on Rails", "Sinatra", "Hanami", "Laravel", "Symfony", "CodeIgniter", "Drupal", "Drupal10", "Phoenix", "Ecto",

    // Databases
    "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle", "SQL Server", "CockroachDB", "TiDB",
    "MongoDB", "Cassandra", "ScyllaDB", "DynamoDB", "CosmosDB", "Couchbase", "CouchDB", "RethinkDB",
    "Redis", "Memcached", "Valkey", "Dragonfly", "Neo4j", "ArangoDB", "SurrealDB", "EdgeDB",
    "Supabase", "Firebase", "Appwrite", "PocketBase", "Hasura", "Prisma", "Drizzle ORM", "TypeORM",
    "Sequelize", "Mongoose", "SQLAlchemy", "Tortoise ORM", "Peewee", "Alembic", "Knex.js", "Kysely",

    // Infrastructure & DevOps
    "Docker", "Docker Compose", "Podman", "LXC", "CRI-O", "Containerd",
    "Kubernetes", "K8s", "K3s", "Minikube", "Kind", "Helm", "Kustomize", "ArgoCD", "Flux",
    "Terraform", "OpenTofu", "Pulumi", "Ansible", "Chef", "Puppet", "SaltStack", "Nix", "NixOS",
    "AWS", "Amazon Web Services", "EC2", "Lambda", "S3", "CloudFormation", "CDK",
    "Google Cloud", "GCP", "GKE", "Cloud Run", "App Engine", "Compute Engine",
    "Azure", "AKS", "Azure Functions", "App Service", "Cosmos DB",
    "Vercel", "Netlify", "Heroku", "Railway", "Fly.io", "Render", "DigitalOcean", "Linode", "Hetzner",
    "Cloudflare", "Cloudflare Workers", "Pages", "R2", "D1", "Durable Objects",
    "Nginx", "Apache", "Caddy", "Traefik", "Envoy", "HAProxy", "Istio", "Linkerd", "Kong",
    "Linux", "Ubuntu", "Debian", "Fedora", "CentOS", "RHEL", "Arch Linux", "Alpine", "Kali",
    "Systemd", "Init", "Cron", "SSH", "SSL", "TLS", "DNS", "DHCP", "VPN", "WireGuard", "OpenVPN",
    "CDN", "Load Balancing", "High Availability", "Scalability", "Microservices", "Serverless",
    "Observability", "Prometheus", "Grafana", "Loki", "Jaeger", "OpenTelemetry", "ELK Stack",
    "Datadog", "New Relic", "Sentry", "LogRocket", "Splunk", "PagerDuty",

    // CI/CD & Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "Gitea", "Mercurial", "SVN",
    "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI", "Jenkins", "Bamboo", "TeamCity", "Drone",
    "Jira", "Confluence", "Trello", "Linear", "Notion", "Slack", "Discord", "Teams",
    "Vim", "Neovim", "Emacs", "Nano", "VSCode", "IntelliJ", "PyCharm", "WebStorm", "CLion", "Rider", "Android Studio",
    "Postman", "Insomnia", "Swagger", "OpenAPI", "RPC", "gRPC", "tRPC", "WebSocket", "Socket.io", "WebRTC",

    // --- FRONTEND & MOBILE ---
    // Web Frameworks
    "React", "Next.js", "Remix", "Gatsby", "Preact", "SolidJS", "SolidStart",
    "Vue", "Vue.js", "Nuxt", "Nuxt.js", "VitePress", "Gridsome",
    "Svelte", "SvelteKit", "Angular", "Analog", "Qwik", "Qwik City", "Astro",
    "jQuery", "Backbone", "Ember", "Meteor", "Alpine.js", "HTMX", "Hyperscript",

    // Styling
    "CSS", "Sass", "Less", "Stylus", "PostCSS", "Tailwind CSS", "UnoCSS", "WindiCSS", "Bootstrap",
    "Bulma", "Foundation", "Materialize", "Chakra UI", "Mantine", "Ant Design", "Material UI", "MUI",
    "Radix UI", "Headless UI", "Shadcn UI", "NextUI", "DaisyUI", "Tremor", "Tamagui",
    "Styled Components", "Emotion", "Stitches", "Vanilla Extract", "Panda CSS", "StyleX",

    // Mobile & Cross-Platform
    "React Native", "Expo", "Flutter", "Dart", "SwiftUI", "UIKit", "Jetpack Compose", "Kotlin Multiplatform", "KMP",
    "Ionic", "Capacitor", "Cordova", "PhoneGap", "NativeScript", "Xamarin", "MAUI",
    "Electron", "Tauri", "Wails", "Neutralino", "Proton Native", "Unity", "Unreal Engine", "Godot",

    // Testing
    "Jest", "Vitest", "Mocha", "Chai", "Jasmine", "Karma", "Selenium", "Cypress", "Playwright",
    "Puppeteer", "TestCafe", "Nightwatch", "WebdriverIO", "Appium", "Detox", "Maestro",
    "PyTest", "Unittest", "RSpec", "JUnit", "TestNG", "NUnit", "XUnit", "Go Test",
    "Testing Library", "Enzyme", "Storybook", "Lighthouse",

    // --- HIGH PERFORMANCE COMPUTING (HPC) ---
    "HPC", "MPI", "OpenMP", "OpenCL", "CUDA", "CuDNN", "HIP", "ROCm", "OneAPI", "SYCL",
    "Parallel Computing", "Distributed Systems", "Supercomputing", "Cluster", "Slurm", "PBS",
    "Moab", "Lustre", "GPFS", "InfiniBand", "RDMA", "NUMA", "FPGA Acceleration", "GPU Acceleration",
    "Optimization", "Profiling", "Debugging", "Valgrind", "GDB", "Perf", "VTune", "Nsight",

    // --- OTHER CONCEPTS ---
    "Algorithms", "Data Structures", "Design Patterns", "System Design", "Architecture",
    "Blockchain", "Web3", "Ethereum", "Smart Contracts", "DeFi", "NFT", "Solana", "Bitcoin",
    "Cryptography", "Security", "Penetration Testing", "Ethical Hacking", "OWASP", "Auth0", "Clerk",
    "OAuth", "OIDC", "JWT", "SAML", "LDAP", "Kerberos", "RBAC", "ABAC",
    "Game Development", "Graphics Programming", "Shaders", "GLSL", "HLSL", "Ray Tracing",
    "VR", "AR", "XR", "Metaverse", "WebXR", "A-Frame",
    "Bioinformatics", "Genomics", "Computational Biology", "Cheminformatics",
    "Fintech", "Quant", "Algorithmic Trading", "High Frequency Trading",
]
