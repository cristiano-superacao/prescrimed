import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta

st.set_page_config(page_title="Prescrimed Streamlit", page_icon="🏥", layout="wide")

st.markdown("""
<style>
:root{--primary:#4F46E5;--dark:#1F2937;--light:#F3F4F6}
.metric-card{background:#fff;border-radius:1rem;padding:1.5rem;box-shadow:0 4px 12px rgba(0,0,0,.08);border-left:4px solid var(--primary)}
@media(max-width:768px){.metric-card{padding:1rem}}
</style>
""", unsafe_allow_html=True)

st.title("🏥 Prescrimed Analytics (Streamlit)")
st.caption("Dashboard responsivo e profissional")

c1,c2,c3,c4=st.columns(4)
with c1: st.metric("Pacientes", "1.234", "↑ 12%")
with c2: st.metric("Prescrições", "856", "↑ 8%")
with c3: st.metric("Receita", "R$ 145.280", "↑ 15%")
with c4: st.metric("Satisfação", "4.8/5.0", "↑ 0.2")

st.divider()

col1,col2=st.columns(2)
with col1:
    st.subheader("Evolução de Pacientes")
    df=pd.DataFrame({"Data":pd.date_range(datetime.now()-timedelta(days=30), periods=30),"Pacientes":[100+i*2+(i%5)*3 for i in range(30)]})
    fig=px.line(df,x="Data",y="Pacientes",markers=True)
    fig.update_layout(height=300,margin=dict(l=0,r=0,t=0,b=0))
    st.plotly_chart(fig,use_container_width=True)
with col2:
    st.subheader("Prescrições por Tipo")
    df=pd.DataFrame({"Tipo":["Medicamentos","Exames","Procedimentos","Outros"],"Quantidade":[450,220,150,36]})
    fig=px.pie(df,values="Quantidade",names="Tipo",hole=.4)
    fig.update_layout(height=300,margin=dict(l=0,r=0,t=0,b=0))
    st.plotly_chart(fig,use_container_width=True)

st.divider()

st.info("Versão inicial. Integração com API preparada.")
