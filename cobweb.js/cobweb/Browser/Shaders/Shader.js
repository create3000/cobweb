
define (function ()
{
"use strict";

	var Shader =
	{
		getShaderSource: function (source)
		{
			var constants = "";

			constants += "#define x3d_GeometryPoints  0\n";
			constants += "#define x3d_GeometryLines   1\n";
			constants += "#define x3d_Geometry2D      2\n";
			constants += "#define x3d_Geometry3D      3\n";
		
			constants += "#define x3d_MaxClipPlanes  6\n";
		
			constants += "#define x3d_NoFog            0\n";
			constants += "#define x3d_LinearFog        1\n";
			constants += "#define x3d_ExponentialFog   2\n";
			constants += "#define x3d_Exponential2Fog  3\n";
		
			constants += "#define x3d_MaxLights         8\n";
			constants += "#define x3d_NoLight           0\n";
			constants += "#define x3d_DirectionalLight  1\n";
			constants += "#define x3d_PointLight        2\n";
			constants += "#define x3d_SpotLight         3\n";
		
			constants += "#define x3d_MaxTextures                1\n";
			constants += "#define x3d_NoTexture                  0\n";
			constants += "#define x3d_TextureType2D              2\n";
			constants += "#define x3d_TextureType3D              3\n";
			constants += "#define x3d_TextureTypeCubeMapTexture  4\n";
		
			constants += "#define x3d_ShadowSamples  8\n";

			constants += "#line 1\n";

			return constants + source;
		},
	};

	return Shader;
});
