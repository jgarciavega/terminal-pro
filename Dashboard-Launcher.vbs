Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Definir rutas absolutas
Dim projectPath, nodePath
projectPath = "c:\Users\jorge\terminalDos"
nodePath = projectPath & "\api\server.js"

' Verificar que el archivo del servidor existe
If Not objFSO.FileExists(nodePath) Then
    MsgBox "❌ Error: No se encuentra el archivo server.js en " & nodePath, 16, "Terminal Dos - Error"
    WScript.Quit
End If

' Cambiar al directorio del proyecto
objShell.CurrentDirectory = projectPath

' Verificar si el servidor ya está corriendo en el puerto 3000
Dim serverRunning
serverRunning = False

On Error Resume Next
Set objExec = objShell.Exec("netstat -ano | findstr :3000")
If objExec.StdOut.ReadAll <> "" Then
    serverRunning = True
End If
On Error GoTo 0

If Not serverRunning Then
    ' Servidor no está corriendo, iniciarlo (silenciosamente)
    objShell.Run "cmd /c node api\server.js", 0, False
    
    ' Esperar a que el servidor arranque
    WScript.Sleep 5000
End If

' Abrir el dashboard en el navegador predeterminado
objShell.Run "http://localhost:3000/dashboard-nuevo.html", 1
