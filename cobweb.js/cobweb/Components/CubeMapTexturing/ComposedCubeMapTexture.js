
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/CubeMapTexturing/X3DEnvironmentTextureNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentTextureNode,
          X3DCast,
          X3DConstants)
{
"use strict";

	function ComposedCubeMapTexture (executionContext)
	{
		X3DEnvironmentTextureNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ComposedCubeMapTexture);

		this .textures = [null, null, null, null, null, null];
	}

	ComposedCubeMapTexture .prototype = $.extend (Object .create (X3DEnvironmentTextureNode .prototype),
	{
		constructor: ComposedCubeMapTexture,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "front",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "back",     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "left",     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "right",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "bottom",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "top",      new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "ComposedCubeMapTexture";
		},
		getComponentName: function ()
		{
			return "CubeMapTexturing";
		},
		getContainerField: function ()
		{
			return "texture";
		},
		initialize: function ()
		{
			X3DEnvironmentTextureNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .target = gl .TEXTURE_CUBE_MAP;

			this .targets = [
				gl .TEXTURE_CUBE_MAP_POSITIVE_Z, // Front, front and back are swaped, otherwise background images cannot be used!
				gl .TEXTURE_CUBE_MAP_NEGATIVE_Z, // Back
				gl .TEXTURE_CUBE_MAP_NEGATIVE_X, // Left
				gl .TEXTURE_CUBE_MAP_POSITIVE_X, // Right
				gl .TEXTURE_CUBE_MAP_POSITIVE_Y, // Top
				gl .TEXTURE_CUBE_MAP_NEGATIVE_Y, // Bottom
			];

			gl .bindTexture (gl .TEXTURE_CUBE_MAP, this .getTexture ());

			gl .texParameteri (gl .TEXTURE_CUBE_MAP, gl .TEXTURE_WRAP_S,     gl .REPEAT);
			gl .texParameteri (gl .TEXTURE_CUBE_MAP, gl .TEXTURE_WRAP_T,     gl .REPEAT);
			//gl .texParameteri (gl .TEXTURE_CUBE_MAP, gl .TEXTURE_WRAP_R,     gl .REPEAT);
			gl .texParameteri (gl .TEXTURE_CUBE_MAP, gl .TEXTURE_MIN_FILTER, gl .NEAREST);
			gl .texParameteri (gl .TEXTURE_CUBE_MAP, gl .TEXTURE_MAG_FILTER, gl .NEAREST);
	
			gl .bindTexture (gl .TEXTURE_CUBE_MAP, null);

			this .front_  .addInterest (this, "set_texture__", 0);
			this .back_   .addInterest (this, "set_texture__", 1);
			this .left_   .addInterest (this, "set_texture__", 2);
			this .right_  .addInterest (this, "set_texture__", 3);
			this .top_    .addInterest (this, "set_texture__", 5);
			this .bottom_ .addInterest (this, "set_texture__", 4);

			this .set_texture__ (this .front_,  0);
			this .set_texture__ (this .back_,   1);
			this .set_texture__ (this .left_,   2);
			this .set_texture__ (this .right_,  3);
			this .set_texture__ (this .top_,    4);
			this .set_texture__ (this .bottom_, 5);
		},
		getTarget: function ()
		{
			return this .target;
		},
		getTextureType: function ()
		{
			return 4;
		},
		set_texture__: function (node, index)
		{
			if (this .textures [index])
				this .textures [index] .texture_changed_ .removeInterest (this, "setTexture");

			var texture = this .textures [index] = X3DCast (X3DConstants .X3DTexture2DNode, node);

			if (texture)
				texture .texture_changed_ .addInterest (this, "setTexture", index, texture);

			this .setTexture (null, index, texture);
		},
		setTexture: function (output, index, texture)
		{
			var
				gl     = this .getBrowser () .getContext (),
				target = this .targets [index];

			if (texture)
			{
				var transparent = false;

				for (var i = 0; i < 6; ++ i)
				{
					var tex = this .textures [i];

					if (tex)
						transparent |= tex .transparent_ .getValue ();
				}

				if (transparent !== this .transparent_ .getValue ())
					this .transparent_ = transparent;

				var
					gl     = this .getBrowser () .getContext (),
					width  = texture .getWidth (),
					height = texture .getHeight (),
					data   = texture .getData ();

				gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, texture .getFlipY ());
				gl .pixelStorei (gl .UNPACK_ALIGNMENT, 1);
				gl .bindTexture (gl .TEXTURE_CUBE_MAP, this .getTexture ());
				gl .texImage2D (target, 0, gl .RGBA, width, height, false, gl .RGBA, gl .UNSIGNED_BYTE, data);
				gl .bindTexture (gl .TEXTURE_CUBE_MAP, null);
			}
			else
			{
				gl .bindTexture (gl .TEXTURE_CUBE_MAP, this .getTexture ());
				gl .texImage2D (target, 0, gl .RGBA, 1, 1, false, gl .RGBA, gl .UNSIGNED_BYTE, new Uint8Array ([ 255, 255, 255, 255 ]));
				gl .bindTexture (gl .TEXTURE_CUBE_MAP, null);
			}
		},
	});

	return ComposedCubeMapTexture;
});


