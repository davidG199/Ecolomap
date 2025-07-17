// Sistema de captura y validación de datos
        class DataCaptureManager {
            constructor() {
                this.capturedData = {
                    login: null,
                    register: null
                };
                this.validationRules = {
                    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    password: /.{8,}/,
                    name: /.{6,}/
                };
            }

            // Capturar datos del formulario de login
            captureLoginData() {
                const loginData = {
                    email: document.getElementById('loginEmail').value,
                    password: document.getElementById('loginPassword').value,
                    remember: document.getElementById('rememberMe').checked,
                    timestamp: new Date().toISOString()
                };
                
                this.capturedData.login = loginData;
                console.log('📊 DATOS OBTENIDOS DEL LOGIN:', loginData);
                return loginData;
            }

            // Capturar datos del formulario de registro
            captureRegisterData() {
                const registerData = {
                    name: document.getElementById('registerName').value,
                    email: document.getElementById('registerEmail').value,
                    password: document.getElementById('registerPassword').value,
                    confirmPassword: document.getElementById('confirmPassword').value,
                    terms: document.getElementById('acceptTerms').checked,
                    timestamp: new Date().toISOString()
                };
                
                this.capturedData.register = registerData;
                console.log('📊 DATOS OBTENIDOS DEL REGISTRO:', registerData);
                return registerData;
            }

            // Validar datos capturados
            validateData(data, type) {
                const errors = [];
                
                if (type === 'login') {
                    // Validar email
                    if (!data.email) {
                        errors.push('El correo es requerido');
                    } else if (!this.validationRules.email.test(data.email)) {
                        errors.push('El formato del correo no es válido');
                    }
                    
                    // Validar contraseña
                    if (!data.password) {
                        errors.push('La contraseña es requerida');
                    } else if (!this.validationRules.password.test(data.password)) {
                        errors.push('La contraseña debe tener al menos 8 caracteres');
                    }
                    
                } else if (type === 'register') {
                    // Validar nombre
                    if (!data.name) {
                        errors.push('El nombre es requerido');
                    } else if (!this.validationRules.name.test(data.name)) {
                        errors.push('El nombre debe tener al menos 6 caracteres');
                    }
                    
                    // Validar email
                    if (!data.email) {
                        errors.push('El correo es requerido');
                    } else if (!this.validationRules.email.test(data.email)) {
                        errors.push('El formato del correo no es válido');
                    }
                    
                    // Validar contraseña
                    if (!data.password) {
                        errors.push('La contraseña es requerida');
                    } else if (!this.validationRules.password.test(data.password)) {
                        errors.push('La contraseña debe tener al menos 8 caracteres');
                    }
                    
                    // Validar confirmación de contraseña
                    if (data.password !== data.confirmPassword) {
                        errors.push('Las contraseñas no coinciden');
                    }
                    
                    // Validar términos
                    if (!data.terms) {
                        errors.push('Debes aceptar los términos y condiciones');
                    }
                }
                
                const isValid = errors.length === 0;
                console.log(`✅ VALIDACIÓN ${type.toUpperCase()}:`, { isValid, errors });
                
                return { isValid, errors };
            }

            // Procesar acceso después de validación exitosa
            processAccess(data, type) {
                if (type === 'login') {
                    return this.processLogin(data);
                } else if (type === 'register') {
                    return this.processRegister(data);
                }
            }

            // Procesar login
            processLogin(data) {
                // Simular verificación de credenciales
                const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const user = storedUsers.find(u => u.email === data.email && u.password === data.password);
                
                if (!user) {
                    throw new Error('Credenciales incorrectas');
                }
                
                // Crear sesión
                const session = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    loginTime: new Date().toISOString(),
                    remember: data.remember
                };
                
                // Guardar sesión
                localStorage.setItem('currentUser', JSON.stringify(session));
                if (data.remember) {
                    localStorage.setItem('userSession', JSON.stringify(session));
                }
                
                console.log('🔐 ACCESO CONCEDIDO:', session);
                return { success: true, user: session };
            }

            // Procesar registro
            processRegister(data) {
                const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                
                // Verificar si el email ya existe
                if (storedUsers.find(u => u.email === data.email)) {
                    throw new Error('El correo ya está registrado');
                }
                
                // Crear nuevo usuario
                const newUser = {
                    id: Date.now(),
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    registeredAt: new Date().toISOString()
                };
                
                // Guardar usuario
                storedUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
                
                console.log('📝 USUARIO REGISTRADO:', newUser);
                return { success: true, user: newUser };
            }

            // Obtener datos capturados
            getCapturedData() {
                return this.capturedData;
            }
        }

        // Instancia del manager
        const dataManager = new DataCaptureManager();

        function showForm(formType) {
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const toggleBtns = document.querySelectorAll('.toggle-btn');
            
            // Remover clase active de todos los botones
            toggleBtns.forEach(btn => btn.classList.remove('active'));
            
            if (formType === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
                toggleBtns[0].classList.add('active');
            } else {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
                toggleBtns[1].classList.add('active');
            }
        }

        function handleLogin(event) {
            event.preventDefault();
            
            try {
                // PASO 1: Capturar datos
                console.log('🔍 PASO 1: Obtenido datos del login...');
                const capturedData = dataManager.captureLoginData();
                
                // Mostrar datos capturados al usuario
                alert(`DATOS OBTENIDOS:\n\n` +
                      `Email: ${capturedData.email}\n` +
                      `Contraseña: ${'*'.repeat(capturedData.password.length)}\n` +
                      `Recordar: ${capturedData.remember ? 'Sí' : 'No'}\n` +
                      `Tiempo: ${new Date(capturedData.timestamp).toLocaleString()}`);
                
                // PASO 2: Validar datos
                console.log('✅ PASO 2: Validando datos...');
                const validation = dataManager.validateData(capturedData, 'login');
                
                if (!validation.isValid) {
                    alert(`ERRORES DE VALIDACIÓN:\n\n${validation.errors.join('\n')}`);
                    return;
                }
                
                alert('✅ VALIDACIÓN EXITOSA\n\nProcediendo a verificar acceso...');
                
                // PASO 3: Procesar acceso
                console.log('🚀 PASO 3: Procesando acceso...');
                const accessResult = dataManager.processAccess(capturedData, 'login');
                
                if (accessResult.success) {
                    alert(`🎉 ACCESO CONCEDIDO\n\n` +
                          `Bienvenido: ${accessResult.user.name}\n` +
                          `Email: ${accessResult.user.email}\n` +
                          `Sesión iniciada: ${new Date().toLocaleString()}`);
                    
                    showUserPanel(accessResult.user);
                }
                
            } catch (error) {
                alert(`❌ ERROR: ${error.message}`);
                console.error('Error en login:', error);
            }
        }

        function handleRegister(event) {
            event.preventDefault();
            
            try {
                // PASO 1: Capturar datos
                console.log('🔍 PASO 1: Obteniendo datos del registro...');
                const capturedData = dataManager.captureRegisterData();
                
                // Mostrar datos capturados al usuario
                alert(`DATOS OBTENIDOS:\n\n` +
                      `Nombre: ${capturedData.name}\n` +
                      `Email: ${capturedData.email}\n` +
                      `Contraseña: ${'*'.repeat(capturedData.password.length)}\n` +
                      `Términos: ${capturedData.terms ? 'Aceptados' : 'No aceptados'}\n` +
                      `Tiempo: ${new Date(capturedData.timestamp).toLocaleString()}`);
                
                // PASO 2: Validar datos
                console.log('✅ PASO 2: Validando datos...');
                const validation = dataManager.validateData(capturedData, 'register');
                
                if (!validation.isValid) {
                    alert(`ERRORES DE VALIDACIÓN:\n\n${validation.errors.join('\n')}`);
                    return;
                }
                
                alert('✅ VALIDACIÓN EXITOSA\n\nProcediendo a crear cuenta...');
                
                // PASO 3: Procesar registro
                console.log('🚀 PASO 3: Procesando registro...');
                const registrationResult = dataManager.processAccess(capturedData, 'register');
                
                if (registrationResult.success) {
                    alert(`🎉 REGISTRO EXITOSO\n\n` +
                          `Usuario: ${registrationResult.user.name}\n` +
                          `Email: ${registrationResult.user.email}\n` +
                          `Registrado: ${new Date().toLocaleString()}\n\n` +
                          `Ahora puedes iniciar sesión.`);
                    
                    // Limpiar formulario y cambiar a login
                    document.getElementById('registerForm').reset();
                    showForm('login');
                    document.getElementById('loginEmail').value = registrationResult.user.email;
                }
                
            } catch (error) {
                alert(`❌ ERROR: ${error.message}`);
                console.error('Error en registro:', error);
            }
        }

        function showUserPanel(user) {
            const container = document.querySelector('.container');
            container.innerHTML = `
                <div style="text-align: center; position: relative; z-index: 1;">
                    <h2 style="color: white; margin-bottom: 20px;">¡Acceso Concedido!</h2>
                    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <p style="color: white; margin-bottom: 10px;"><strong>Nombre:</strong> ${user.name}</p>
                        <p style="color: white; margin-bottom: 10px;"><strong>Email:</strong> ${user.email}</p>
                        <p style="color: white;"><strong>Sesión iniciada:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <button onclick="logout()" style="background: linear-gradient(135deg, #ff6b6b, #feca57); border: none; padding: 10px 20px; border-radius: 5px; color: white; cursor: pointer; margin-right: 10px;">Cerrar Sesión</button>
                    <button onclick="showCapturedData()" style="background: linear-gradient(135deg, #4ecdc4, #48cae4); border: none; padding: 10px 20px; border-radius: 5px; color: white; cursor: pointer;">Ver Datos Capturados</button>
                </div>
            `;
        }

        function logout() {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userSession');
            alert('Sesión cerrada correctamente');
            location.reload();
        }

        function showCapturedData() {
            const capturedData = dataManager.getCapturedData();
            const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const currentSession = JSON.parse(localStorage.getItem('currentUser') || 'null');
            
            let dataReport = 'DATOS CAPTURADOS Y ALMACENADOS:\n\n';
            
            if (capturedData.login) {
                dataReport += `ÚLTIMO LOGIN CAPTURADO:\n`;
                dataReport += `• Email: ${capturedData.login.email}\n`;
                dataReport += `• Recordar: ${capturedData.login.remember ? 'Sí' : 'No'}\n`;
                dataReport += `• Tiempo: ${new Date(capturedData.login.timestamp).toLocaleString()}\n\n`;
            }
            
            if (capturedData.register) {
                dataReport += `ÚLTIMO REGISTRO CAPTURADO:\n`;
                dataReport += `• Nombre: ${capturedData.register.name}\n`;
                dataReport += `• Email: ${capturedData.register.email}\n`;
                dataReport += `• Tiempo: ${new Date(capturedData.register.timestamp).toLocaleString()}\n\n`;
            }
            
            dataReport += `USUARIOS REGISTRADOS (${storedUsers.length}):\n`;
            storedUsers.forEach(user => {
                dataReport += `• ${user.name} (${user.email})\n`;
            });
            
            dataReport += `\nSESIÓN ACTUAL:\n`;
            dataReport += currentSession ? `${currentSession.name} (${currentSession.email})` : 'No hay sesión activa';
            
            alert(dataReport);
        }

        // Verificar sesión al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar si hay sesión guardada
            const savedSession = JSON.parse(localStorage.getItem('userSession') || 'null');
            if (savedSession) {
                localStorage.setItem('currentUser', JSON.stringify(savedSession));
                showUserPanel(savedSession);
                return;
            }

            // Efectos visuales para inputs
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.value.length > 0) {
                        this.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    } else {
                        this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }
                });
            });
        });
