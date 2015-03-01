
require (["cobweb/X3D"],
function (X3D)
{
	X3D (function ()
	{
		var Browser = X3D .getBrowser ($("X3D"));

		Browser .print ("Welcome to " + Browser .name + " X3D Browser " + Browser .version + ":\n" +
		                "        Current Graphics Renderer\n" +
		                "                Name: " + Browser .getVendor () + " " + Browser .getWebGLVersion () + "\n" +
		                "                Shading language: " + Browser .getShadingLanguageVersion () + "\n" +
		                "        Rendering Properties\n" +
		                "                Texture units: " + Browser .getMaxTextureUnits () + " / " + Browser .getMaxCombinedTextureUnits () + "\n" +
		                "                Max texture size: " + Browser .getMaxTextureSize () + " × " + Browser .getMaxTextureSize () + " pixel\n" +
		                "                Max lights: 0\n" +
		                "                Max vertex uniform vectors: " + Browser .getMaxVertexUniformVectors () + "\n" +
		                "                Max fragment uniform vectors: " + Browser .getMaxFragmentUniformVectors () + "\n" +
		                "                Max vertex attribs: " + Browser .getMaxVertexAttribs () + "\n" +
		                "                Antialiased: " + Browser .getAntialiased () + "\n" +
		                "                Color depth: " + Browser .getColorDepth () + " bits\n");
	});
});
