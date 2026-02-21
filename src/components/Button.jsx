function Button({children,color="blue"}) {
    return <button style={{color:color}}>
        {children}
    </button>
}
export default Button