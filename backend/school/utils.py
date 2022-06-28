def check_has_child_in_class(children, school_class):
    has_child_in_class = False
    for child in children:
        if child.school_class == school_class:
            has_child_in_class = True
    return has_child_in_class