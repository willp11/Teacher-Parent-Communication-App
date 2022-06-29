import string
import random

def check_has_child_in_class(children, school_class):
    has_child_in_class = False
    for child in children:
        if child.school_class == school_class:
            has_child_in_class = True
    return has_child_in_class

def generate_invite_code():
    letters = []
    for chr in string.ascii_lowercase:
        letters.append(chr)
    for chr in string.ascii_uppercase:
        letters.append(chr)

    code = ""

    for i in range(8):
        code += letters[random.randint(0,51)]
    
    return code
    