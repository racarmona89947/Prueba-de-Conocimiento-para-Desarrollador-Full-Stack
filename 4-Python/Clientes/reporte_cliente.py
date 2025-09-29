import pandas as pd


df = pd.read_csv("reporte_pedidos_clientes.csv")

# 1. Promedio del valor total de pedidos
promedio = df["Valor Total del Pedido"].mean()

# 2. Top 3 clientes por valor total
top3 = df.sort_values("Valor Total del Pedido", ascending=False).head(3)

print(" Promedio del valor total de pedidos:", promedio)
print("\n Top 3 clientes por valor total:")
print(top3)
