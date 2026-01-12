def apply_graph_coloring(students):
    color_map = {}
    color = 0

    for s in students:
        if s["dept"] not in color_map:
            color_map[s["dept"]] = color
            color += 1
        s["color"] = color_map[s["dept"]]

    return students
