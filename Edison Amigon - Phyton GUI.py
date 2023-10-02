from tkinter import *
#from tkinter.ttk import *

#call a window variable
window = Tk()
window.geometry('300x250')
window.title('Tkinter Assignment')
#add various elements
button1 = Button(window, text = "Botton 1", font = ("Helvetica-weighted bold", 9))
button1.grid(row = 1, column = 2, padx = 5, pady = 10)

button1 = Button(window, text = "Botton 2", font = ("Helvetica-weighted bold", 9))
button1.grid(row = 1, column = 4, padx = 5, pady = 10)

label1 = Label(window, text = "label 1", font = ("Helvetica-weighted bold", 9))

label1.grid(row = 1, column = 1, padx = 5, pady = 10)
label1 = Label(window, text = "Label 2", font = ("Helvetica-weighted bold", 9))
label1.grid(row = 1, column = 3, padx = 5, pady = 10)

#To add text
Entry(window).grid(row=2, column=1)



#close the windows loop, where the window ends
window.mainloop()
