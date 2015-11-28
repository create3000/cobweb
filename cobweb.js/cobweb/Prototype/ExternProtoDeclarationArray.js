
define ([
	"jquery",
],
function ($)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			if (parseInt (key) == key)
				return target .array [key];

			return target .index [key];
		},
		set: function (target, key, value)
		{
			var X3DExternProtoDeclaration = require ("cobweb/Prototype/X3DExternProtoDeclaration");

			if (value instanceof X3DExternProtoDeclaration)
			{
				target .array [key] = value;
				target .index       = { };

				for (var i = 0; i < target .array .length; ++ i)
				{
					var externproto = target .array [i];

					target .index [externproto .getName ()] = externproto;
				}

				return true;
			}

			return false;
		},
	};

	function ExternProtoDeclarationArray ()
	{
		this .array = [ ];
		this .index = { };

		return new Proxy (this, handler);
	}

	$.extend (ExternProtoDeclarationArray .prototype,
	{
		constructor: ExternProtoDeclarationArray,
		push: function (externproto)
		{
			var X3DExternProtoDeclaration = require ("cobweb/Prototype/X3DExternProtoDeclaration");

			if (externproto instanceof X3DExternProtoDeclaration)
			{
				this .index [externproto .getName ()] = externproto;

				return this .array .push (externproto);
			}

			return this .array .length;
		},
	});

	Object .defineProperty (ExternProtoDeclarationArray .prototype, "length",
	{
		get: function () { return this .array .length; },
		enumerable: false,
		configurable: false
	});

	return ExternProtoDeclarationArray;
});
