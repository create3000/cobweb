

define ([
	"jquery",
],
function ($)
{
	return {
		indent: "",
		indentChar: "  ",
		Indent: function ()
		{
			return this .indent;
		},
		IncIndent: function ()
		{
			this .indent += this .indentChar;
		},
		DecIndent: function ()
		{
			this .indent = this .indent .substr (0, this .indent .length - this .indentChar .length);
		},
	};
});
